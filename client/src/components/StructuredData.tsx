import { useEffect } from 'react';
import { toJsonLdScript } from '@/lib/structuredData';

interface StructuredDataProps {
  data: Record<string, unknown>;
}

/**
 * Componente para injetar structured data (JSON-LD) no head
 * Usado para SEO e rich snippets no Google
 */
export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = toJsonLdScript(data);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [data]);

  return null;
}
