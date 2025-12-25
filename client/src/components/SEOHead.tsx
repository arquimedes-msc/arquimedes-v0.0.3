import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noindex?: boolean;
  structuredData?: object;
}

const DEFAULT_TITLE = 'Arquimedes - Matemática Descomplicada';
const DEFAULT_DESCRIPTION =
  'Plataforma de educação em matemática para adultos. Aulas interativas de Aritmética, Álgebra, Geometria e Cálculo. Aprenda no seu ritmo com gamificação!';
const DEFAULT_KEYWORDS = [
  'matemática online',
  'aulas de matemática',
  'aritmética',
  'álgebra',
  'geometria',
  'cálculo',
  'educação adultos',
  'EJA',
  'matemática básica',
  'curso de matemática',
];
const SITE_URL = 'https://arquimedes.manus.space';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogType = 'website',
  ogImage = OG_IMAGE,
  noindex = false,
  structuredData,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | Arquimedes` : DEFAULT_TITLE;
  const canonicalUrl = canonical || SITE_URL;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Arquimedes - Matemática Descomplicada" />
      <meta httpEquiv="content-language" content="pt-BR" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Arquimedes" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@arquimedes" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
}

// Helper functions para criar structured data

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Arquimedes',
    alternateName: 'Arquimedes - Matemática Descomplicada',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      'Plataforma de educação em matemática para adultos com aulas interativas e gamificação.',
    foundingDate: '2025',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
    },
  };
}

export function createCourseSchema(courseName: string, description: string, duration: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: courseName,
    description,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Arquimedes',
      url: SITE_URL,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: duration, // e.g., "PT60H"
    },
    educationalLevel: 'Beginner',
    inLanguage: 'pt-BR',
    availableLanguage: 'pt-BR',
  };
}

export function createLessonSchema(
  lessonName: string,
  description: string,
  duration: string,
  courseName: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lessonName,
    description,
    learningResourceType: 'Lesson',
    educationalLevel: 'Beginner',
    timeRequired: duration, // e.g., "PT45M"
    inLanguage: 'pt-BR',
    isPartOf: {
      '@type': 'Course',
      name: courseName,
    },
    author: {
      '@type': 'EducationalOrganization',
      name: 'Arquimedes',
    },
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
