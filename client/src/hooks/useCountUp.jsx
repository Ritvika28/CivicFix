import { useState, useEffect, useRef } from 'react';

export function useCountUp(endValue, duration = 800) {
  const numericValue = typeof endValue === 'number' ? endValue : parseInt(endValue, 10);
  const isNumeric = !isNaN(numericValue);

  const [count, setCount] = useState(isNumeric ? numericValue : (endValue || 0));
  const ref = useRef(null);
  const hasAnimated = useRef(false);
  const prevValue = useRef(numericValue);

  useEffect(() => {
    if (!isNumeric) {
      setCount(endValue);
      return;
    }

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(numericValue);
      return;
    }

    // Handle dynamic endValue updates after async data load
    if (prevValue.current !== numericValue) {
      const startVal = typeof prevValue.current === 'number' && !isNaN(prevValue.current) ? prevValue.current : 0;
      prevValue.current = numericValue;
      hasAnimated.current = true;

      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(startVal + easeOutProgress * (numericValue - startVal)));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(numericValue);
        }
      };
      window.requestAnimationFrame(step);
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
        } else if (hasAnimated.current) {
          setCount(numericValue);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [numericValue, endValue, duration, isNumeric]);

  return { count, ref };
}

export function AnimatedNumber({ value, className = '', suffix = '' }) {
  const numericValue = typeof value === 'number' ? value : parseInt(value, 10);
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

