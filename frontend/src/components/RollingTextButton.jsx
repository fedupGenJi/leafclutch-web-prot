import { motion, useReducedMotion } from 'motion/react';
import { useRef, useState } from 'react';

// Outgoing copy exits downward while the incoming copy drops in from above,
// so the label reads as a single strip rolling down through the window.
const outgoingVariants = {
  rest: { transform: 'translateY(0%)' },
  active: { transform: 'translateY(100%)' },
};

const incomingVariants = {
  rest: { transform: 'translateY(-100%)' },
  active: { transform: 'translateY(0%)' },
};

const transition = {
  duration: 0.3,
  ease: [0.338, 0.015, 0.395, 0.959],
};

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function RollingTextButton({
  href,
  label = 'Contact Us',
  className = '',
  onNavigate,
}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const animating = useRef(false);
  const pendingRequest = useRef(null);
  const hovered = useRef(false);
  const focused = useRef(false);

  const updateActive = (next) => {
    activeRef.current = next;
    setActive(next);
  };

  // Hover in and straight back out is faster than the 300ms roll. Queueing the
  // latest request and replaying it on completion keeps the two copies from
  // desyncing mid-flight and leaving a blank window.
  const requestActive = (next) => {
    if (reduceMotion) return;

    if (next === activeRef.current) {
      pendingRequest.current = null;
      return;
    }

    if (animating.current) {
      pendingRequest.current = next;
      return;
    }

    animating.current = true;
    updateActive(next);
  };

  const completeAnimation = () => {
    if (!animating.current) return;
    animating.current = false;

    if (pendingRequest.current !== null && pendingRequest.current !== activeRef.current) {
      const next = pendingRequest.current;
      pendingRequest.current = null;
      animating.current = true;
      updateActive(next);
    } else {
      pendingRequest.current = null;
    }
  };

  return (
    <motion.a
      href={href}
      className={`fresh-primary-action ${className}`}
      aria-label={label}
      onClick={onNavigate}
      // Hover and focus are tracked separately so tabbing away while the
      // pointer is still over the button doesn't roll the label back.
      onHoverStart={() => {
        hovered.current = true;
        requestActive(true);
      }}
      onHoverEnd={() => {
        hovered.current = false;
        requestActive(focused.current);
      }}
      onFocus={() => {
        focused.current = true;
        requestActive(true);
      }}
      onBlur={() => {
        focused.current = false;
        requestActive(hovered.current);
      }}
    >
      <span className="fresh-primary-action-content" aria-hidden="true">
        <span className="label-window">
          <motion.span
            className="label-copy"
            variants={outgoingVariants}
            initial="rest"
            animate={active ? 'active' : 'rest'}
            onAnimationComplete={completeAnimation}
            transition={transition}
          >
            {label}
          </motion.span>
          <motion.span
            className="label-copy label-copy--incoming"
            variants={incomingVariants}
            initial="rest"
            animate={active ? 'active' : 'rest'}
            transition={transition}
          >
            {label}
          </motion.span>
        </span>
        <span className="fresh-primary-action-arrow">
          <ChevronRightIcon />
        </span>
      </span>
    </motion.a>
  );
}
