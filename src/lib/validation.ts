import { z } from "zod";
import type { ContactFormPayload } from "@/types/portfolio";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must not exceed 100 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .max(254, "Email address must not exceed 254 characters.")
    .email("Please enter a valid email address."),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters.")
    .max(150, "Subject must not exceed 150 characters."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message must not exceed 2000 characters."),
});

export type ContactFieldErrors = Partial<
  Record<keyof ContactFormPayload, string>
>;

export function validateContactForm(
  payload: ContactFormPayload
): { success: true; data: ContactFormPayload } | { success: false; errors: ContactFieldErrors } {
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
