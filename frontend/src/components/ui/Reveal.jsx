import { useEffect, useRef } from 'react';

/**
 * Reveals its children once they scroll into view.
 * Falls back to "always visible" when IntersectionObserver is unavailable,
 * and CSS handles prefers-reduced-motion.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
