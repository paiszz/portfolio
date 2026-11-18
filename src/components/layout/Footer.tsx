import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-bg-primary py-10 text-text-secondary">
      <div className="container-editorial flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center bg-surface-dark font-mono text-xs font-semibold tracking-widest text-surface-light">
            {SITE_CONFIG.monogram}
          </span>
          <span className="font-mono text-xs tracking-wider text-text-primary uppercase">
            {SITE_CONFIG.name}
          </span>
        </div>

        <p className="font-mono text-[11px] tracking-widest uppercase">
          ridwanfaiz.web.id
        </p>
      </div>
    </footer>
  );
}
