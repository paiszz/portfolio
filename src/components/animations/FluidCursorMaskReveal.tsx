"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface FluidCursorMaskRevealProps {
  baseSrc: string;
  revealSrc: string;
  baseAlt: string;
  revealAlt: string;
  maskRadius?: number;
  trailLength?: number;
  smoothness?: number;
  isRevealed?: boolean;
  className?: string;
}

interface TrailPoint {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
}

function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function FluidCursorMaskReveal({
  baseSrc,
  revealSrc,
  baseAlt,
  revealAlt,
  maskRadius = 92,
  trailLength = 18,
  smoothness = 0.2,
  isRevealed = false,
  className,
}: FluidCursorMaskRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealImgRef = useRef<HTMLImageElement | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  const rafRef = useRef<number | null>(null);
  const isInsideRef = useRef(false);
  const targetRef = useRef({ x: 0, y: 0 });
  const lastMoveRef = useRef(0);
  const pointsRef = useRef<TrailPoint[]>(
    Array.from({ length: trailLength }, () => ({
      x: 0,
      y: 0,
      r: 0,
      vx: 0,
      vy: 0,
    }))
  );

  // Preload reveal image for Canvas 2D compositing
  useEffect(() => {
    const img = new window.Image();
    img.src = revealSrc;
    revealImgRef.current = img;

    return () => {
      revealImgRef.current = null;
    };
  }, [revealSrc]);

  // Keep canvas resolution synced to container dimensions
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || shouldReduceMotion) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = {
        width: rect.width,
        height: rect.height,
        dpr,
      };
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const startLoop = () => {
    if (shouldReduceMotion || rafRef.current !== null) return;

    const tick = () => {
      const canvas = canvasRef.current;
      const revealImg = revealImgRef.current;
      const points = pointsRef.current;

      if (!canvas || points.length === 0) {
        rafRef.current = null;
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafRef.current = null;
        return;
      }

      const { width: cw, height: ch, dpr } = sizeRef.current;
      if (cw <= 0 || ch <= 0) {
        rafRef.current = window.requestAnimationFrame(tick);
        return;
      }

      const clampedSmoothness = Math.min(Math.max(smoothness, 0.05), 0.55);
      const now = performance.now();
      const isRecentlyMoving = now - lastMoveRef.current < 1600;
      const target = targetRef.current;

      const prevX = points[0].x;
      const prevY = points[0].y;
      points[0].x = lerp(prevX, target.x, clampedSmoothness);
      points[0].y = lerp(prevY, target.y, clampedSmoothness);
      points[0].vx = points[0].x - prevX;
      points[0].vy = points[0].y - prevY;

      const distToTarget = Math.hypot(target.x - prevX, target.y - prevY);
      const activeHeadRadius =
        isInsideRef.current && isRecentlyMoving
          ? maskRadius + Math.min(distToTarget * 0.28, maskRadius * 0.4)
          : 0;

      points[0].r = lerp(
        points[0].r,
        activeHeadRadius,
        isInsideRef.current ? clampedSmoothness * 0.85 : clampedSmoothness * 0.6
      );

      for (let i = 1; i < points.length; i++) {
        const followFactor = Math.max(
          0.08,
          clampedSmoothness * (1 - i / (points.length * 1.4))
        );
        const px = points[i].x;
        const py = points[i].y;
        points[i].x = lerp(px, points[i - 1].x, followFactor);
        points[i].y = lerp(py, points[i - 1].y, followFactor);
        points[i].vx = points[i].x - px;
        points[i].vy = points[i].y - py;

        const taper = 1 - i / points.length;
        const targetRadius = points[0].r * Math.pow(taper, 0.72);
        points[i].r = lerp(points[i].r, targetRadius, followFactor);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      const maxRadius = points.reduce((acc, pt) => Math.max(acc, pt.r), 0);
      if (!isInsideRef.current && maxRadius < 0.4) {
        rafRef.current = null;
        return;
      }

      // Draw organic liquid mask trail onto canvas
      ctx.globalCompositeOperation = "source-over";
      for (let i = points.length - 1; i >= 0; i--) {
        const pt = points[i];
        if (pt.r <= 0.5) continue;

        const speed = Math.hypot(pt.vx, pt.vy);
        const stretch = 1 + Math.min(speed * 0.03, 0.55);
        const angle = speed > 0.2 ? Math.atan2(pt.vy, pt.vx) : 0;

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(angle);
        ctx.scale(stretch, 1 / Math.sqrt(stretch));

        const grad = ctx.createRadialGradient(0, 0, pt.r * 0.42, 0, 0, pt.r);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.68, "rgba(255, 255, 255, 0.96)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, pt.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Fill the liquid mask with opaque white first so transparent regions in the
      // almamater SVG never let the wider shirt underneath peek through, then draw revealImg atop.
      if (revealImg && revealImg.complete && revealImg.naturalWidth > 0) {
        const imgW = revealImg.naturalWidth;
        const imgH = revealImg.naturalHeight;
        const coverScale = Math.max(cw / imgW, ch / imgH);
        const drawW = imgW * coverScale;
        const drawH = imgH * coverScale;
        const dx = (cw - drawW) / 2;
        const dy = (ch - drawH) / 2;

        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, cw, ch);

        ctx.globalCompositeOperation = "source-atop";
        ctx.drawImage(revealImg, dx, dy, drawW, drawH);
        ctx.globalCompositeOperation = "source-over";
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
  };

  const updatePointerCoordinates = (clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (pointsRef.current.length !== trailLength || !isInsideRef.current) {
      pointsRef.current = Array.from({ length: trailLength }, () => ({
        x,
        y,
        r: 0,
        vx: 0,
        vy: 0,
      }));
    }

    targetRef.current = { x, y };
    isInsideRef.current = true;
    lastMoveRef.current = performance.now();
    startLoop();
  };

  const cssVars = {
    "--fluid-mask-radius": `${maskRadius}px`,
    "--fluid-trail-length": String(trailLength),
    "--fluid-smoothness": String(smoothness),
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      style={cssVars}
      onPointerEnter={(event) => {
        if (shouldReduceMotion) return;
        updatePointerCoordinates(event.clientX, event.clientY);
      }}
      onPointerMove={(event) => {
        if (shouldReduceMotion) return;
        updatePointerCoordinates(event.clientX, event.clientY);
      }}
      onPointerLeave={() => {
        isInsideRef.current = false;
      }}
      onPointerCancel={() => {
        isInsideRef.current = false;
      }}
      className={cn("relative h-full w-full overflow-hidden", className)}
    >
      {/* Base Layer (Shirt Portrait) */}
      <Image
        src={baseSrc}
        alt={baseAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 480px"
        className="object-cover"
        priority
      />

      {/* HTML5 Canvas Fluid Cursor Mask Reveal Layer */}
      {!shouldReduceMotion && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      )}

      {/* Full Reveal Fallback / Explicit Toggle Layer (Almamater Portrait) */}
      <motion.div
        aria-hidden={!isRevealed}
        initial={false}
        animate={{ opacity: isRevealed ? 1 : 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
        }
        className="pointer-events-none absolute inset-0 bg-bg-primary"
      >
        <Image
          src={revealSrc}
          alt={revealAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 480px"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
