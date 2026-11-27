import { useEffect } from 'react';
import { OG_IMAGE_URL, SITE_NAME, getCanonicalUrl } from '../../config/siteConfig.js';

function setMetaTag(attrName, attrValue, content) {
  if (typeof document === 'undefined' || !content) return;
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonicalLink(href) {
  if (typeof document === 'undefined' || !href) return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function setJsonLdScript(id, payload) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById(id);
  if (!payload || (Array.isArray(payload) && payload.length === 0)) {
    if (existing) existing.remove();
    return;
  }
  let script = existing;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

/**
 * Synchronizes route-specific document title, meta description, canonical URL,
 * Open Graph / Twitter social share cards, robots directives, and JSON-LD structured data.
 */
export default function SeoHead({
  title,
  description,
  path = '/',
  robots = 'index, follow',
  ogType = 'website',
  ogImage = OG_IMAGE_URL,
  ogImageAlt = `${SITE_NAME} — THE LOST CIVILIZATION Official Fest Banner`,
  jsonLd = null,
}) {
  const canonicalUrl = getCanonicalUrl(path);
  const fullTitle = title || `${SITE_NAME} — THE LOST CIVILIZATION | HIET Tech Fest`;

  useEffect(() => {
    document.title = fullTitle;

    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', robots);
    setCanonicalLink(canonicalUrl);

    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:image:secure_url', ogImage);
    setMetaTag('property', 'og:image:alt', ogImageAlt);

    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);
    setMetaTag('name', 'twitter:image:alt', ogImageAlt);

    setJsonLdScript('route-seo-jsonld', jsonLd);
  }, [fullTitle, description, canonicalUrl, robots, ogType, ogImage, ogImageAlt, jsonLd]);

  return null;
}
