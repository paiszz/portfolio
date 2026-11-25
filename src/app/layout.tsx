import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { SmoothScrollProvider } from "@/components/animations/SmoothScrollProvider";
import { Navbar } from "@/components/navigation/Navbar";
import { DoorTransitionOverlay } from "@/components/projects/DoorTransitionOverlay";
import { DoorTransitionProvider } from "@/context/DoorTransitionContext";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary font-sans">
        <MotionProvider>
          <DoorTransitionProvider>
            <SmoothScrollProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90] focus:bg-surface-dark focus:px-4 focus:py-2.5 focus:font-mono focus:text-xs focus:font-semibold focus:tracking-widest focus:text-surface-light focus:uppercase focus:outline-2 focus:outline-offset-2 focus:outline-text-primary"
              >
                Skip to main content
              </a>
              <Navbar />
              {children}
              <DoorTransitionOverlay />
            </SmoothScrollProvider>
          </DoorTransitionProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
