/**
 * Helpers para gerar structured data (Schema.org) para SEO
 * Melhora indexação no Google e exibição em rich snippets
 */

interface CourseStructuredDataProps {
  name: string;
  description: string;
  provider: string;
  url: string;
  imageUrl?: string;
}

interface LessonStructuredDataProps {
  name: string;
  description: string;
  courseUrl: string;
  position: number;
  url: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Gera structured data para curso educacional
 * Tipo: Course (https://schema.org/Course)
 */
export function generateCourseStructuredData(props: CourseStructuredDataProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": props.name,
    "description": props.description,
    "provider": {
      "@type": "Organization",
      "name": props.provider,
      "url": "https://arquimedes.manus.space"
    },
    "url": props.url,
    "image": props.imageUrl,
    "educationalLevel": "Ensino Fundamental e Médio",
    "inLanguage": "pt-BR",
    "isAccessibleForFree": true,
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT40H"
    }
  };
}

/**
 * Gera structured data para aula/lição
 * Tipo: LearningResource (https://schema.org/LearningResource)
 */
export function generateLessonStructuredData(props: LessonStructuredDataProps) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": props.name,
    "description": props.description,
    "learningResourceType": "Lesson",
    "isPartOf": {
      "@type": "Course",
      "url": props.courseUrl
    },
    "position": props.position,
    "url": props.url,
    "inLanguage": "pt-BR",
    "isAccessibleForFree": true,
    "educationalUse": "self-study"
  };
}

/**
 * Gera structured data para breadcrumbs
 * Tipo: BreadcrumbList (https://schema.org/BreadcrumbList)
 */
export function generateBreadcrumbStructuredData(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Gera structured data para organização
 * Tipo: EducationalOrganization (https://schema.org/EducationalOrganization)
 */
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Arquimedes",
    "description": "Plataforma de educação em matemática e ciências",
    "url": "https://arquimedes.manus.space",
    "logo": "https://arquimedes.manus.space/logo.png",
    "sameAs": [
      // Adicionar redes sociais quando disponíveis
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "availableLanguage": "Portuguese"
    }
  };
}

/**
 * Gera structured data para artigo de blog
 * Tipo: Article (https://schema.org/Article)
 */
export function generateArticleStructuredData(props: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": props.title,
    "description": props.description,
    "author": {
      "@type": "Person",
      "name": props.author
    },
    "datePublished": props.datePublished,
    "dateModified": props.dateModified || props.datePublished,
    "url": props.url,
    "image": props.imageUrl,
    "publisher": {
      "@type": "Organization",
      "name": "Arquimedes",
      "logo": {
        "@type": "ImageObject",
        "url": "https://arquimedes.manus.space/logo.png"
      }
    },
    "inLanguage": "pt-BR"
  };
}

/**
 * Gera structured data para FAQ
 * Tipo: FAQPage (https://schema.org/FAQPage)
 */
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Converte objeto structured data para JSON-LD script tag
 */
export function toJsonLdScript(data: Record<string, unknown>): string {
  return JSON.stringify(data, null, 2);
}
