import { useRef } from 'react';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';

interface CharProps {
  char: string;
  range: [number, number];
  progress: MotionValue<number>;
}

function AnimatedChar({ char, range, progress }: CharProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="opacity-20" aria-hidden="true">
        {char === ' ' ? '\u00A0' : char}
      </span>
      <motion.span
        style={{ opacity }}
        className="absolute inset-0"
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
}

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className = '' }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.25'],
  });

  const words = text.split(' ');
  const totalChars = text.length;
  let charCursor = 0;

  return (
    <p
      ref={ref}
      className={className}
      style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
    >
      {words.map((word, wIdx) => {
        const chars = Array.from(word);
        const wordEl = (
          <span key={`${word}-${wIdx}`} className="inline-block whitespace-nowrap">
            {chars.map((ch, cIdx) => {
              const idx = charCursor++;
              const start = idx / totalChars;
              const end = Math.min(1, (idx + 1) / totalChars);
              return (
                <AnimatedChar
                  key={`${wIdx}-${cIdx}`}
                  char={ch}
                  range={[start, end]}
                  progress={scrollYProgress}
                />
              );
            })}
          </span>
        );

        // Advance cursor for space
        if (wIdx < words.length - 1) {
          charCursor++;
        }

        return (
          <span key={`wrap-${wIdx}`}>
            {wordEl}
            {wIdx < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </p>
  );
}
