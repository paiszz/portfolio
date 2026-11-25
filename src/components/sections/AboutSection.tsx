import { ArrowUpRight, Download } from "lucide-react";
import { ABOUT_DATA } from "@/data/about";
import { Reveal } from "@/components/animations/Reveal";
import { InteractivePortrait } from "@/components/sections/InteractivePortrait";

const CV_HREF = "/cv/CV_Ridwan%20Faiz%20Herlambang.pdf";

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative border-b border-border-subtle bg-bg-primary py-20 md:py-28"
    >
      <div className="container-editorial">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Narrative & Academic Identity */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="border-b border-border-subtle pb-6">
                <h2
                  id="about-heading"
                  className="font-editorial-display text-3xl font-bold tracking-tight text-text-primary sm:text-5xl"
                >
                  {ABOUT_DATA.heading}
                </h2>
                <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-text-secondary sm:text-lg">
                  {ABOUT_DATA.subheading}
                </p>
              </div>
            </Reveal>

            <div className="divide-y divide-border-subtle">
              {ABOUT_DATA.paragraphs.map((item, index) => {
                const stepNumber = String(index + 1).padStart(2, "0");

                return (
                  <Reveal
                    key={item.id}
                    delay={0.08 * (index + 1)}
                    yOffset={16}
                    className="py-6 first:pt-6 last:pb-0"
                  >
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:gap-6">
                      <div className="sm:col-span-4">
                        <span className="font-mono text-xs font-medium tracking-wider text-text-secondary uppercase tabular-nums">
                          {`${stepNumber} — ${item.label}`}
                        </span>
                      </div>
                      <div className="sm:col-span-8">
                        <p className="max-w-[65ch] text-sm leading-relaxed text-text-primary sm:text-base">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.36} yOffset={14} className="mt-8 border-t border-border-subtle pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={CV_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-surface-dark px-5 py-2.5 font-mono text-xs font-semibold tracking-widest text-surface-light uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
                >
                  <span>View CV</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>

                <a
                  href={CV_HREF}
                  download="CV_Ridwan Faiz Herlambang.pdf"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-border-subtle bg-bg-primary px-5 py-2.5 font-mono text-xs font-semibold tracking-widest text-text-primary uppercase transition-colors hover:border-text-primary hover:bg-bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Download CV</span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Interactive Dual Portrait */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <Reveal delay={0.15}>
              <InteractivePortrait portraits={ABOUT_DATA.portraits} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
