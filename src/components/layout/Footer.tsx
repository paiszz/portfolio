import { CONTACT_DATA } from "@/data/contact";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-bg-primary py-10 text-text-secondary">
      <div className="container-editorial flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center bg-surface-dark font-mono text-xs font-semibold tracking-widest text-surface-light">
            {SITE_CONFIG.monogram}
          </span>
          <span className="font-mono text-xs tracking-wider text-text-primary uppercase">
            {SITE_CONFIG.name}
          </span>
        </div>

        <nav
          aria-label="Social links"
          className="flex flex-wrap items-center gap-5"
        >
          {CONTACT_DATA.channels
            .filter((channel) => channel.isConfigured && channel.href)
            .map((channel) => (
              <a
                key={channel.id}
                href={channel.href}
                target={channel.id === "email" ? undefined : "_blank"}
                rel={
                  channel.id === "email" ? undefined : "noopener noreferrer"
                }
                className="font-mono text-[11px] tracking-widest text-text-secondary uppercase transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
              >
                {channel.id === "email" ? "Email" : channel.label}
              </a>
            ))}
          <span className="font-mono text-[11px] tracking-widest text-text-secondary uppercase">
            ridwanfaiz.web.id
          </span>
        </nav>
      </div>
    </footer>
  );
}
