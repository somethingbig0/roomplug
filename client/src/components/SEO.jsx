import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = 'RoomPlug | Student Accommodation in Zimbabwe';
const DEFAULT_DESCRIPTION =
  'Find student accommodation, lodges, general rooms and BnBs in Zimbabwe with RoomPlug. Browse room prices, locations, photos and short video tours.';
const DEFAULT_IMAGE = '/favicon.svg';

export const absoluteUrl = (value = '/') => {
  if (typeof window === 'undefined') return value;
  try {
    return new URL(value, window.location.origin).toString();
  } catch {
    return value;
  }
};

const upsertMeta = (selector, attributes, content) => {
  if (typeof document === 'undefined') return;

  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  element.setAttribute('content', content || '');
};

const upsertLink = (rel, href) => {
  if (typeof document === 'undefined') return;

  let element = document.head.querySelector(`link[rel='${rel}']`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
};

const setStructuredData = (jsonLd) => {
  if (typeof document === 'undefined') return;

  const id = 'roomplug-structured-data';
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  if (!jsonLd) return;

  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
};

export function usePageSEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = '/',
  image = DEFAULT_IMAGE,
  robots = 'index,follow',
  type = 'website',
  jsonLd = null,
} = {}) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const canonical = absoluteUrl(canonicalPath);
    const ogImage = absoluteUrl(image || DEFAULT_IMAGE);

    document.title = title;

    upsertMeta("meta[name='description']", { name: 'description' }, description);
    upsertMeta("meta[name='robots']", { name: 'robots' }, robots);
    upsertMeta(
      "meta[name='theme-color']",
      { name: 'theme-color' },
      '#38bdf8'
    );

    upsertMeta("meta[property='og:title']", { property: 'og:title' }, title);
    upsertMeta(
      "meta[property='og:description']",
      { property: 'og:description' },
      description
    );
    upsertMeta("meta[property='og:type']", { property: 'og:type' }, type);
    upsertMeta("meta[property='og:url']", { property: 'og:url' }, canonical);
    upsertMeta("meta[property='og:site_name']", { property: 'og:site_name' }, 'RoomPlug');
    upsertMeta("meta[property='og:locale']", { property: 'og:locale' }, 'en_ZW');
    upsertMeta("meta[property='og:image']", { property: 'og:image' }, ogImage);
    upsertMeta(
      "meta[property='og:image:alt']",
      { property: 'og:image:alt' },
      title
    );

    upsertMeta("meta[name='twitter:card']", { name: 'twitter:card' }, 'summary_large_image');
    upsertMeta("meta[name='twitter:title']", { name: 'twitter:title' }, title);
    upsertMeta(
      "meta[name='twitter:description']",
      { name: 'twitter:description' },
      description
    );
    upsertMeta("meta[name='twitter:image']", { name: 'twitter:image' }, ogImage);

    upsertLink('canonical', canonical);
    setStructuredData(jsonLd);
  }, [
    title,
    description,
    canonicalPath,
    image,
    robots,
    type,
    JSON.stringify(jsonLd),
  ]);
}

export default function RouteSEO() {
  const location = useLocation();
  const path = location.pathname;

  const privatePrefixes = [
    '/profile',
    '/admin',
    '/create-listing',
    '/update-listing',
    '/sign-in',
    '/sign-up',
    '/search',
  ];

  const isPrivateOrSearch = privatePrefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );

  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESCRIPTION;
  let robots = 'index,follow';

  if (path === '/about') {
    title = 'How RoomPlug Works | Student Accommodation in Zimbabwe';
    description =
      'Learn how RoomPlug helps students and renters find accommodation in Zimbabwe through room information, photos, video tours and a safer connection process.';
  }

  if (isPrivateOrSearch) {
    robots = 'noindex,nofollow';
  }

  if (path !== '/' && !path.startsWith('/section/') && !path.startsWith('/listing/') && path !== '/about' && !isPrivateOrSearch) {
    robots = 'noindex,follow';
  }

  usePageSEO({
    title,
    description,
    canonicalPath: path || '/',
    robots,
  });

  return null;
}
