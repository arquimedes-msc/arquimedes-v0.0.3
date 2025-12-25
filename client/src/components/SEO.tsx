import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

/**
 * Componente para gerenciar meta tags de SEO dinamicamente
 * Útil para páginas de aulas, módulos e disciplinas
 */
export function SEO({ 
  title, 
  description, 
  keywords,
  ogImage = 'https://arquimedes.manus.space/og-image.png',
  canonical
}: SEOProps) {
  useEffect(() => {
    // Atualizar título
    if (title) {
      document.title = `${title} | Arquimedes - Matemática Descomplicada`;
    }

    // Atualizar description
    if (description) {
      updateMetaTag('name', 'description', description);
      updateMetaTag('property', 'og:description', description);
      updateMetaTag('name', 'twitter:description', description);
    }

    // Atualizar keywords
    if (keywords) {
      updateMetaTag('name', 'keywords', keywords);
    }

    // Atualizar OG image
    if (ogImage) {
      updateMetaTag('property', 'og:image', ogImage);
      updateMetaTag('name', 'twitter:image', ogImage);
    }

    // Atualizar canonical
    if (canonical) {
      updateLinkTag('canonical', canonical);
    }

    // Atualizar OG title
    if (title) {
      updateMetaTag('property', 'og:title', title);
      updateMetaTag('name', 'twitter:title', title);
    }
  }, [title, description, keywords, ogImage, canonical]);

  return null;
}

function updateMetaTag(attribute: string, attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attributeValue);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
}
