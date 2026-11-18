import { SITE_CONFIG } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="flex-1 bg-bg-primary text-text-primary">
      <section className="container-editorial py-24 md:py-32">
        <div className="border-b border-border-subtle pb-8">
          <p className="font-industrial-mono text-xs text-text-secondary">
            PHASE 01 — FOUNDATION READY
          </p>
          <h1 className="font-editorial-display mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            {SITE_CONFIG.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">
            Modern Minimalist + Industrial Editorial architecture initialized
            with Next.js App Router, TypeScript, Tailwind CSS, Geist typography,
            and Motion.
          </p>
        </div>
      </section>
    </main>
  );
}
