import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

const DEFAULT_DURATION = 1400; // ms
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// Counts up from 0 to `value` once the element scrolls into view, then holds.
// `once: true` on useInView means it never re-triggers on subsequent scrolls,
// matching how the about page's numbers are meant to read as a single reveal.
export default function AnimatedCounter({ value = 0, duration = DEFAULT_DURATION }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return undefined;

    if (reduceMotion) {
      setDisplay(value);
      return undefined;
    }

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(easeOutCubic(progress) * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value, duration, reduceMotion]);

  return <span ref={ref}>{display}</span>;
}
