import { z } from "zod";
import type { ContactFormPayload } from "@/types/portfolio";

export function sanitizeSingleLine(value: string): string {
  return value
    .replace(/[\r\n\0\u0008\u000B\u000C\u001B\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeMessageBody(value: string): string {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/[\0\u0008\u000B\u000C\u001B\u007F]/g, "")
    .trim();
}

export const contactSchema = z.object({
  name: z
    .string()
    .transform(sanitizeSingleLine)
    .pipe(
      z
        .string()
        .min(2, "Name must be at least 2 characters.")
        .max(100, "Name must not exceed 100 characters.")
    ),
  email: z
    .string()
    .transform(sanitizeSingleLine)
    .pipe(
      z
        .string()
        .min(1, "Email address is required.")
        .max(254, "Email address must not exceed 254 characters.")
        .email("Please enter a valid email address.")
    ),
  subject: z
    .string()
    .transform(sanitizeSingleLine)
    .pipe(
      z
        .string()
        .min(3, "Subject must be at least 3 characters.")
        .max(150, "Subject must not exceed 150 characters.")
    ),
  message: z
    .string()
    .transform(sanitizeMessageBody)
    .pipe(
      z
        .string()
        .min(10, "Message must be at least 10 characters.")
        .max(2000, "Message must not exceed 2000 characters.")
    ),
});

export const contactSubmissionSchema = contactSchema.extend({
  website: z.string().max(200).optional().default(""),
});

export type ContactFieldErrors = Partial<
  Record<keyof ContactFormPayload, string>
>;

export function validateContactForm(
  payload: ContactFormPayload
):
  | { success: true; data: ContactFormPayload }
  | { success: false; errors: ContactFieldErrors } {
  const result = contactSchema.safeParse(payload);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ContactFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ContactFormPayload | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return { success: false, errors };
}
