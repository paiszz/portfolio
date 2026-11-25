import { ArrowUpRight } from "lucide-react";
import { CONTACT_DATA, type ContactChannel } from "@/data/contact";
import { Reveal } from "@/components/animations/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";

function ChannelIcon({ id }: { id: ContactChannel["id"] }) {
  switch (id) {
    case "instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <circle
            cx="12"
            cy="12"
            r="4"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <circle cx="17.25" cy="6.75" r="1" fill="currentColor" />
        </svg>
      );
    case "linkedin":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M8 11v5M8 8v.01M12 16v-5m0 2c0-1.5 1-2 2.2-2 1.2 0 1.8.8 1.8 2v3"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "github":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative border-b border-border-subtle bg-bg-primary py-20 md:py-28"
    >
      <div className="container-editorial">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Heading & Verified Contact Channels */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="border-b border-border-subtle pb-6">
                <h2
                  id="contact-heading"
                  className="font-editorial-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                >
                  {CONTACT_DATA.heading}
                </h2>
                <p className="mt-4 max-w-[55ch] text-sm leading-relaxed text-text-secondary sm:text-base">
                  {CONTACT_DATA.description}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="mt-6 space-y-3">
              {CONTACT_DATA.channels.map((channel) => {
                const content = (
                  <div className="flex items-center justify-between gap-4 border border-border-subtle bg-bg-secondary/50 px-4 py-3.5 transition-colors hover:border-text-primary/40">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-bg-primary text-text-primary">
                        <ChannelIcon id={channel.id} />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-[11px] font-semibold tracking-wider text-text-primary uppercase">
                          {channel.label}
                        </p>
                        <p className="truncate font-mono text-xs text-text-secondary">
                          {channel.value}
                        </p>
                      </div>
                    </div>

                    {channel.isConfigured && channel.href ? (
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-text-primary"
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="shrink-0 border border-border-subtle bg-bg-primary px-2 py-0.5 font-mono text-[10px] tracking-widest text-text-secondary uppercase">
                        TBD
                      </span>
                    )}
                  </div>
                );

                if (channel.isConfigured && channel.href) {
                  return (
                    <a
                      key={channel.id}
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
                    >
                      {content}
                    </a>
                  );
                }

                return <div key={channel.id}>{content}</div>;
              })}
            </Reveal>
          </div>

          {/* Right Column: Contact Form UI */}
          <div className="lg:col-span-7">
            <Reveal delay={0.12}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
