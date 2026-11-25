import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { ProjectCardStack } from "@/components/projects/ProjectCardStack";
import { SectorPageShell } from "@/components/projects/SectorPageShell";
import { getSectorProjects, SECTOR_CATEGORIES } from "@/data/projects";
import { SITE_CONFIG } from "@/lib/constants";

interface SectorPageProps {
  params: Promise<{ sector: string }>;
}

export function generateStaticParams() {
  return SECTOR_CATEGORIES.map((category) => ({
    sector: category.id.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: SectorPageProps): Promise<Metadata> {
  const { sector } = await params;
  const matched = SECTOR_CATEGORIES.find(
    (item) => item.id.toLowerCase() === sector.toLowerCase()
  );

  if (!matched) {
    return {
      title: `Sector Not Found | ${SITE_CONFIG.name}`,
    };
  }

  return {
    title: `${matched.id} — ${matched.title} | ${SITE_CONFIG.name}`,
    description: `${matched.tagline} — ${matched.capabilities.join(", ")}.`,
    alternates: {
      canonical: `/projects/${matched.id.toLowerCase()}`,
    },
  };
}

async function SectorContent({ params }: SectorPageProps) {
  const { sector } = await params;
  const activeSector = SECTOR_CATEGORIES.find(
    (item) => item.id.toLowerCase() === sector.toLowerCase()
  );

  if (!activeSector) {
    notFound();
  }

  const sectorProjects = getSectorProjects(activeSector.id);

  return (
    <SectorPageShell>
      {/* Top-Left Sector Title & Concise Description */}
      <header className="border-b border-border-subtle pb-8">
        <h1 className="font-editorial-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl">
          {activeSector.title}
        </h1>
        <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-text-secondary sm:text-lg">
          {activeSector.tagline}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-surface-dark px-3 py-1 font-mono text-[11px] font-semibold tracking-widest text-surface-light uppercase">
            {activeSector.id}
          </span>
          {activeSector.capabilities.map((capability) => (
            <span
              key={capability}
              className="rounded-full border border-border-subtle bg-bg-secondary px-3 py-1 font-mono text-[11px] tracking-wider text-text-primary uppercase"
            >
              {capability}
            </span>
          ))}
        </div>
      </header>

      {/* Sticky Stacking Project Cards */}
      <ProjectCardStack
        sector={activeSector}
        allSectors={SECTOR_CATEGORIES}
        projects={sectorProjects}
      />
    </SectorPageShell>
  );
}

function SectorFallback() {
  return (
    <div className="container-editorial min-h-[60vh] py-12 font-mono text-xs tracking-widest text-text-secondary uppercase">
      Loading sector archive...
    </div>
  );
}

export default function SectorProjectsPage({ params }: SectorPageProps) {
  return (
    <>
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 bg-bg-primary pt-28 pb-20 text-text-primary focus:outline-none md:pt-32 md:pb-24"
      >
        <Suspense fallback={<SectorFallback />}>
          <SectorContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
