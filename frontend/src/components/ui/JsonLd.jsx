import { useEffect } from 'react';

/** Injects one JSON-LD block for the current page and removes it on unmount. */
export default function JsonLd({ data, id = 'page-jsonld' }) {
  useEffect(() => {
    if (!data) return undefined;
    let script = document.getElementById(id);
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => {
      script?.parentNode?.removeChild(script);
    };
  }, [data, id]);

  return null;
}
