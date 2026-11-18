"use client";

import { motion, useReducedMotion } from "motion/react";

interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}

const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

export function TextReveal({
  text,
  as = "h1",
  className,
  staggerDelay = 0.045,
  initialDelay = 0.08,
}: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  const Tag = as;

  if (shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  let charCursor = 0;

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span className="inline-flex flex-wrap" aria-hidden="true">
        {words.map((word, wordIndex) => {
          const chars = Array.from(word);
          return (
            <span
              key={`${word}-${wordIndex}`}
              className="inline-flex whitespace-nowrap"
            >
              {chars.map((char, index) => {
                const currentCharIndex = charCursor++;
                return (
                  <span
                    key={`${char}-${index}`}
                    className="inline-block overflow-hidden align-bottom"
                  >
                    <motion.span
                      className="inline-block will-change-transform"
                      initial={{ y: "105%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{
                        duration: 0.65,
                        delay: initialDelay + currentCharIndex * staggerDelay,
                        ease: EDITORIAL_EASE,
                      }}
                    >
                      {char}
                    </motion.span>
                  </span>
                );
              })}
              {wordIndex < words.length - 1 && (
                <span className="inline-block">&nbsp;</span>
              )}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
