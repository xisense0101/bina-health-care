import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig, seoConfig } from '../lib/config';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export function SEO({ 
  title, 
  description, 
  keywords,
  ogImage,
  canonicalUrl,
  type = 'website',
  publishedTime,
  modifiedTime,
  author
}: SEOProps) {
  const location = useLocation();
  
  // Use config defaults if not provided
  const finalKeywords = keywords || seoConfig.keywords;
  const finalOgImage = ogImage || seoConfig.ogImage;
  const finalCanonicalUrl = canonicalUrl || `${siteConfig.url}${location.pathname}`;
  const finalTitle = `${title} | ${siteConfig.name}`;
  
  useEffect(() => {
    // Set document title
    document.title = finalTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', finalKeywords);
    updateMetaTag('author', author || siteConfig.name);
    updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    
    // Language
    updateMetaTag('language', 'English');
    updateMetaTag('geo.region', 'USA');
    updateMetaTag('geo.placename', 'El Sobrante');

    // Open Graph tags
    updateMetaTag('og:title', finalTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', finalOgImage, true);
    updateMetaTag('og:url', finalCanonicalUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', siteConfig.name, true);
    updateMetaTag('og:locale', 'en_US', true);
    
    if (publishedTime) {
      updateMetaTag('article:published_time', publishedTime, true);
    }
    if (modifiedTime) {
      updateMetaTag('article:modified_time', modifiedTime, true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', finalOgImage);
    updateMetaTag('twitter:site', seoConfig.twitterHandle);
    updateMetaTag('twitter:creator', seoConfig.twitterHandle);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', finalCanonicalUrl);
    
    // Alternate language link (for future multi-language support)
    let alternate = document.querySelector('link[rel="alternate"]');
    if (!alternate) {
      alternate = document.createElement('link');
      alternate.setAttribute('rel', 'alternate');
      alternate.setAttribute('hreflang', 'en');
      document.head.appendChild(alternate);
    }
    alternate.setAttribute('href', finalCanonicalUrl);

  }, [finalTitle, description, finalKeywords, finalOgImage, finalCanonicalUrl, type, publishedTime, modifiedTime, author]);

  // Add structured data (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/binalogo.png`,
        description: siteConfig.description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: siteConfig.contact.address,
          addressLocality: 'Kathmandu',
          addressCountry: 'US'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: siteConfig.contact.phone,
          contactType: 'customer service',
          availableLanguage: ['en', 'ne'],
          areaServed: 'US'
        },
        sameAs: [
          siteConfig.social.facebook,
          siteConfig.social.instagram,
          siteConfig.social.linkedin
        ]
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteConfig.url}/#localbusiness`,
        name: siteConfig.name,
        image: finalOgImage,
        url: siteConfig.url,
        telephone: siteConfig.contact.phone,
        email: siteConfig.contact.email,
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: siteConfig.contact.address,
          addressLocality: 'Kathmandu',
          addressCountry: 'US'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: siteConfig.location.residential.lat,
          longitude: siteConfig.location.residential.lng
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
          ],
          opens: '00:00',
          closes: '23:59'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '127'
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: {
          '@id': `${siteConfig.url}/#organization`
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteConfig.url}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
