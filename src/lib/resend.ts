import { Resend } from "resend";

export interface ResendConfigResult {
  ok: true;
  resend: Resend;
  toEmail: string;
  fromEmail: string;
}

export interface ResendConfigError {
  ok: false;
  error: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getResendConfig(): ResendConfigResult | ResendConfigError {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const fromEmail =
    process.env.EMAIL_FROM?.trim() || "no-reply@mail.ridwanfaiz.web.id";

  if (!apiKey || !toEmail || !fromEmail) {
    return {
      ok: false,
      error: "Contact service is not configured.",
    };
  }

  if (!EMAIL_PATTERN.test(toEmail) || !EMAIL_PATTERN.test(fromEmail)) {
    return {
      ok: false,
      error: "Contact service configuration is invalid.",
    };
  }

  return {
    ok: true,
    resend: new Resend(apiKey),
    toEmail,
    fromEmail,
  };
}
