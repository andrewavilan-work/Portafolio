import { useRef } from 'react';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';

interface WordProps {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}

function AnimatedWord({ word, range, progress }: WordProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
    </motion.span>
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
  const totalWords = words.length;

  return (
    <p
      ref={ref}
      className={className}
      style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
    >
      {words.map((word, wIdx) => {
        const start = wIdx / totalWords;
        const end = Math.min(1, (wIdx + 1.5) / totalWords);
        return (
          <span key={`${word}-${wIdx}`}>
            <AnimatedWord
              word={word}
              range={[start, end]}
              progress={scrollYProgress}
            />
            {wIdx < totalWords - 1 ? ' ' : ''}
          </span>
        );
      })}
    </p>
  );
}
