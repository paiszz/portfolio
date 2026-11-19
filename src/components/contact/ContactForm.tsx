"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import {
  validateContactForm,
  type ContactFieldErrors,
} from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { ContactFormPayload } from "@/types/portfolio";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface ContactApiResponse {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: ContactFieldErrors;
}

const INITIAL_VALUES: ContactFormPayload = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const shouldReduceMotion = useReducedMotion();

  const [values, setValues] = useState<ContactFormPayload>(INITIAL_VALUES);
  const [honeypot, setHoneypot] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusDetail, setStatusDetail] = useState<string | null>(null);

  const isSubmitting = status === "submitting";

  const handleChange = (
    field: keyof ContactFormPayload,
    nextValue: string
  ) => {
    setValues((prev) => ({ ...prev, [field]: nextValue }));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (status === "error" || status === "success") {
      setStatus("idle");
      setStatusDetail(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const validation = validateContactForm(values);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      setStatus("error");
      setStatusDetail("Please review the highlighted fields before submitting.");
      return;
    }

    setFieldErrors({});
    setStatus("submitting");
    setStatusDetail(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...validation.data,
          website: honeypot,
        }),
      });

      let payload: ContactApiResponse | null = null;
      try {
        payload = (await response.json()) as ContactApiResponse;
      } catch {
        payload = null;
      }

      if (!response.ok || payload?.ok !== true) {
        if (payload?.fieldErrors) {
          setFieldErrors(payload.fieldErrors);
        }
        setStatus("error");
        setStatusDetail(
          payload?.error ||
            "Unable to send your message right now. Your entered data has been preserved for retry."
        );
        return;
      }

      setStatus("success");
      setStatusDetail(
        "Thank you for reaching out. Your message has been delivered."
      );
      setValues(INITIAL_VALUES);
      setHoneypot("");
    } catch {
      setStatus("error");
      setStatusDetail(
        "Network error while sending your message. Your entered data has been preserved for retry."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
      className="border border-border-subtle bg-bg-primary p-5 sm:p-8"
    >
      <div className="mb-6 flex items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <span className="font-mono text-xs font-semibold tracking-widest text-text-primary uppercase">
          Direct Inquiry Form
        </span>
        <span className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
          All Fields Required
        </span>
      </div>

      {/* Honeypot field for spam protection (kept offscreen and excluded from tab order) */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Name Field */}
          <div>
            <label
              htmlFor="contact-name"
              className="block font-mono text-xs font-medium tracking-wider text-text-primary uppercase"
            >
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              disabled={isSubmitting}
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Your name"
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={
                fieldErrors.name ? "contact-name-error" : undefined
              }
              className={cn(
                "mt-2 block w-full border bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/70 transition-colors",
                "focus:border-text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-text-primary disabled:opacity-60",
                fieldErrors.name ? "border-text-primary" : "border-border-subtle"
              )}
            />
            {fieldErrors.name && (
              <p
                id="contact-name-error"
                role="alert"
                className="mt-1.5 font-mono text-[11px] text-text-primary"
              >
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="contact-email"
              className="block font-mono text-xs font-medium tracking-wider text-text-primary uppercase"
            >
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isSubmitting}
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="you@example.com"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={
                fieldErrors.email ? "contact-email-error" : undefined
              }
              className={cn(
                "mt-2 block w-full border bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/70 transition-colors",
                "focus:border-text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-text-primary disabled:opacity-60",
                fieldErrors.email ? "border-text-primary" : "border-border-subtle"
              )}
            />
            {fieldErrors.email && (
              <p
                id="contact-email-error"
                role="alert"
                className="mt-1.5 font-mono text-[11px] text-text-primary"
              >
                {fieldErrors.email}
              </p>
            )}
          </div>
        </div>

        {/* Subject Field */}
        <div>
          <label
            htmlFor="contact-subject"
            className="block font-mono text-xs font-medium tracking-wider text-text-primary uppercase"
          >
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            disabled={isSubmitting}
            value={values.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            placeholder="Project inquiry or collaboration"
            aria-invalid={Boolean(fieldErrors.subject)}
            aria-describedby={
              fieldErrors.subject ? "contact-subject-error" : undefined
            }
            className={cn(
              "mt-2 block w-full border bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/70 transition-colors",
              "focus:border-text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-text-primary disabled:opacity-60",
              fieldErrors.subject
                ? "border-text-primary"
                : "border-border-subtle"
            )}
          />
          {fieldErrors.subject && (
            <p
              id="contact-subject-error"
              role="alert"
              className="mt-1.5 font-mono text-[11px] text-text-primary"
            >
              {fieldErrors.subject}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="contact-message"
              className="block font-mono text-xs font-medium tracking-wider text-text-primary uppercase"
            >
              Message
            </label>
            <span className="font-mono text-[10px] text-text-secondary tabular-nums">
              {values.message.length}/2000
            </span>
          </div>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            disabled={isSubmitting}
            value={values.message}
            onChange={(e) => handleChange("message", e.target.value)}
            placeholder="Tell me about your project, timeline, or how we can collaborate..."
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={
              fieldErrors.message ? "contact-message-error" : undefined
            }
            className={cn(
              "mt-2 block w-full resize-y border bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/70 transition-colors",
              "focus:border-text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-text-primary disabled:opacity-60",
              fieldErrors.message
                ? "border-text-primary"
                : "border-border-subtle"
            )}
          />
          {fieldErrors.message && (
            <p
              id="contact-message-error"
              role="alert"
              className="mt-1.5 font-mono text-[11px] text-text-primary"
            >
              {fieldErrors.message}
            </p>
          )}
        </div>
      </div>

      {/* Status Feedback Banner */}
      <AnimatePresence mode="wait">
        {status === "success" && (
          <motion.div
            key="contact-success"
            role="status"
            aria-live="polite"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="mt-5 flex items-start gap-3 border border-text-primary bg-surface-dark p-4 text-surface-light"
          >
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="font-mono text-xs font-semibold tracking-widest uppercase">
                MESSAGE SENT SUCCESSFULLY
              </p>
              {statusDetail && (
                <p className="mt-1 text-xs text-surface-light/80">
                  {statusDetail}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="contact-error"
            role="alert"
            aria-live="assertive"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="mt-5 flex items-start gap-3 border border-text-primary bg-bg-secondary p-4 text-text-primary"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="font-mono text-xs font-semibold tracking-widest uppercase">
                MESSAGE COULD NOT BE SENT
              </p>
              {statusDetail && (
                <p className="mt-1 text-xs text-text-secondary">
                  {statusDetail}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Action */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-5">
        <p className="font-mono text-[10px] tracking-wider text-text-secondary uppercase">
          Direct Delivery · Reply-To Enabled
        </p>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={
            shouldReduceMotion || isSubmitting ? undefined : { scale: 1.01 }
          }
          whileTap={
            shouldReduceMotion || isSubmitting ? undefined : { scale: 0.99 }
          }
          className={cn(
            "inline-flex min-h-[44px] w-full items-center justify-center gap-2 bg-surface-dark px-6 py-3 font-mono text-xs font-semibold tracking-widest text-surface-light uppercase transition-opacity sm:w-auto",
            "hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>SENDING...</span>
            </>
          ) : (
            <>
              <span>SEND MESSAGE</span>
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
