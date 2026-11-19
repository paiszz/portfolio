import { isIP } from "node:net";
import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import { ContactNotification } from "@/emails/ContactNotification";
import { checkRateLimit } from "@/lib/rate-limit";
import { getResendConfig } from "@/lib/resend";
import {
  contactSubmissionSchema,
  type ContactFieldErrors,
} from "@/lib/validation";
import type { ContactFormPayload } from "@/types/portfolio";

const MAX_BODY_BYTES = 16 * 1024; // 16 KB

/**
 * Extracts client IP from trusted deployment proxy headers only.
 * On Vercel (`VERCEL === "1"`), `x-vercel-forwarded-for` and `x-real-ip` are
 * overwritten by Vercel's Edge Network and cannot be spoofed by clients.
 * When not running behind Vercel's trusted edge (e.g. direct requests without
 * a verified proxy), all client-supplied IP headers are ignored and mapped to
 * the shared `untrusted-client` bucket so rotating fake headers cannot bypass
 * rate limiting.
 */
function getTrustedClientIp(request: Request): string {
  if (process.env.VERCEL !== "1") {
    return "untrusted-client";
  }

  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) {
    const candidate = vercelForwardedFor.split(",")[0]?.trim();
    if (candidate && isIP(candidate) !== 0) {
      return candidate;
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && isIP(realIp) !== 0) {
    return realIp;
  }

  return "untrusted-client";
}

async function readBoundedText(
  request: Request,
  maxBytes: number
): Promise<{ ok: true; text: string } | { ok: false; status: 413 }> {
  if (!request.body) {
    return { ok: true, text: "" };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          await reader.cancel();
          return { ok: false, status: 413 };
        }
        chunks.push(value);
      }
    }
  } finally {
    reader.releaseLock();
  }

  const combined = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { ok: true, text: new TextDecoder("utf-8").decode(combined) };
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { ok: false, error: "Unsupported content type." },
        { status: 415 }
      );
    }

    const contentLengthHeader = request.headers.get("content-length");
    if (contentLengthHeader) {
      const contentLength = Number(contentLengthHeader);
      if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
        return NextResponse.json(
          { ok: false, error: "Request payload is too large." },
          { status: 413 }
        );
      }
    }

    const bodyResult = await readBoundedText(request, MAX_BODY_BYTES);
    if (!bodyResult.ok) {
      return NextResponse.json(
        { ok: false, error: "Request payload is too large." },
        { status: 413 }
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(bodyResult.text);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    if (
      typeof parsedJson !== "object" ||
      parsedJson === null ||
      Array.isArray(parsedJson)
    ) {
      return NextResponse.json(
        { ok: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const validation = contactSubmissionSchema.safeParse(parsedJson);
    if (!validation.success) {
      const fieldErrors: ContactFieldErrors = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as keyof ContactFormPayload | undefined;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }

      return NextResponse.json(
        {
          ok: false,
          error: "Please review the highlighted fields before submitting.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message, website } = validation.data;

    // Honeypot check: reject automated bot submissions
    if (website.trim().length > 0) {
      return NextResponse.json(
        { ok: false, error: "Unable to process submission." },
        { status: 400 }
      );
    }

    const rateLimit = await checkRateLimit(getTrustedClientIp(request));
    if (rateLimit.unavailable) {
      return NextResponse.json(
        {
          ok: false,
          error: "Contact service is temporarily unavailable.",
        },
        { status: 503 }
      );
    }
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Too many requests. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      );
    }

    const resendConfig = getResendConfig();
    if (!resendConfig.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Contact service is temporarily unavailable.",
        },
        { status: 503 }
      );
    }

    const submittedAt =
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "medium",
        timeZone: "Asia/Jakarta",
      }).format(new Date()) + " WIB";

    const emailElement = ContactNotification({
      name,
      email,
      subject,
      message,
      submittedAt,
    });

    const [html, text] = await Promise.all([
      render(emailElement),
      render(emailElement, { plainText: true }),
    ]);

    const { data, error } = await resendConfig.resend.emails.send({
      from: resendConfig.fromEmail,
      to: resendConfig.toEmail,
      replyTo: email,
      subject: `[PORTFOLIO] New Message from ${name}`,
      html,
      text,
    });

    if (error || !data?.id) {
      console.error(
        "[contact-api] Email delivery failed:",
        error?.name ?? "missing_message_id",
        error?.message ?? ""
      );
      return NextResponse.json(
        {
          ok: false,
          error: "Message could not be sent right now. Please try again later.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "MESSAGE SENT SUCCESSFULLY",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(
      "[contact-api] Unexpected error:",
      err instanceof Error ? err.name : "unknown_error"
    );
    return NextResponse.json(
      {
        ok: false,
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
