import { useState, useEffect, useRef } from 'react';

export function useCountUp(endValue, duration = 800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const numericValue = typeof endValue === 'number' ? endValue : parseInt(endValue, 10);
    if (isNaN(numericValue)) {
      setCount(endValue);
      return;
    }

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(numericValue);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOutProgress * numericValue));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(numericValue);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [endValue, duration]);

  return { count, ref };
}

export function AnimatedNumber({ value, className = '', suffix = '' }) {
  const numericValue = parseInt(value, 10);
  const isNumeric = !isNaN(numericValue);
  const { count, ref } = useCountUp(isNumeric ? numericValue : 0);

  if (!isNumeric) {
    return <span className={className}>{value}{suffix}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
}
