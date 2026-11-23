import { ReactNode, useRef } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

/**
 * Zero-re-render magnetic wrapper: mutates transform directly on the DOM node
 * only when the pointer is within the local magnetic zone.
 */
export function Magnet({
  children,
  strength = 4,
  activeTransition = 'transform 0.2s ease-out',
  inactiveTransition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
  className = '',
}: MagnetProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const rect = outer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) / strength;
    const dy = (e.clientY - centerY) / strength;

    inner.style.transition = activeTransition;
    inner.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  };

  const handlePointerLeave = () => {
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.transition = inactiveTransition;
    inner.style.transform = 'translate3d(0px, 0px, 0)';
  };

  return (
    <div
      ref={outerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`inline-block p-3 -m-3 ${className}`}
    >
      <div
        ref={innerRef}
        style={{
          transform: 'translate3d(0px, 0px, 0)',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
