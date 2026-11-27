export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://crossroads-hiet.netlify.app'
).replace(/\/+$/, '');

export const SITE_NAME = 'CROSSROADS 2027';
export const SITE_TAGLINE = 'THE LOST CIVILIZATION | BEYOND THE KNOWN. INTO THE UNKNOWN.';
export const OG_IMAGE_URL = `${SITE_URL}/og-banner.jpg`;

export const INSTITUTE_INFO = {
  name: 'Hi-Tech Institute of Engineering and Technology',
  shortName: 'HIET Ghaziabad',
  organizerName: 'Team Tech Fusion — HIET Ghaziabad',
  email: 'techfusion@hietgroup.org',
  telephone: '+91-8802323375',
  streetAddress: 'Plot No. 766, 26th KM Milestone, NH-9',
  city: 'Ghaziabad',
  region: 'Uttar Pradesh',
  postalCode: '201015',
  country: 'IN',
  latitude: 28.6863,
  longitude: 77.5037,
  sameAs: [
    'https://hiet.org/',
    'https://linkedin.com/company/hiet-techfusion',
    'https://www.instagram.com/hiet.techfusion',
    'https://www.youtube.com/@hietgroup',
  ],
};

export const ROUTE_PATHS = {
  home: '/',
  about: '/about',
  events: '/events',
  schedule: '/schedule',
  team: '/team',
  register: '/register',
  contact: '/contact',
  attendance: '/attendance',
  adminLogin: '/admin/login',
  adminDashboard: '/admin/dashboard',
};

// Map public URL slugs <-> backend EventRegistration enum slugs
export const EVENT_URL_ALIASES = {
  'short-film-maker': 'short-film-making',
};

export function normalizeEventUrlSlug(slug) {
  if (!slug) return '';
  const cleaned = String(slug).trim().toLowerCase();
  return EVENT_URL_ALIASES[cleaned] || cleaned;
}

export function getCanonicalUrl(pathname = '/') {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (cleanPath === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${cleanPath.replace(/\/+$/, '')}`;
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: `${INSTITUTE_INFO.name} (${INSTITUTE_INFO.shortName})`,
    alternateName: ['HIET Ghaziabad', 'CROSSROADS HIET', 'Team Tech Fusion'],
    description:
      'Hi-Tech Institute of Engineering and Technology (HIET), Ghaziabad — host institution of CROSSROADS 2027, an annual inter-college technical and cultural festival organized by Team Tech Fusion.',
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon-512.png`,
      width: 512,
      height: 512,
    },
    image: OG_IMAGE_URL,
    telephone: INSTITUTE_INFO.telephone,
    email: INSTITUTE_INFO.email,
    priceRange: 'Free',
    address: {
      '@type': 'PostalAddress',
      streetAddress: INSTITUTE_INFO.streetAddress,
      addressLocality: INSTITUTE_INFO.city,
      addressRegion: INSTITUTE_INFO.region,
      postalCode: INSTITUTE_INFO.postalCode,
      addressCountry: INSTITUTE_INFO.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: INSTITUTE_INFO.latitude,
      longitude: INSTITUTE_INFO.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Event Registration & Student Support',
      telephone: INSTITUTE_INFO.telephone,
      email: INSTITUTE_INFO.email,
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: INSTITUTE_INFO.sameAs,
  };
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: `${SITE_NAME} — ${INSTITUTE_INFO.shortName}`,
    alternateName: 'CROSSROADS HIET Ghaziabad',
    url: `${SITE_URL}/`,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
  };
}

export function buildFestivalJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Festival',
    '@id': `${SITE_URL}/#festival`,
    name: 'CROSSROADS 2027 — THE LOST CIVILIZATION',
    description:
      'Annual inter-college technical and cultural festival hosted by HIET Ghaziabad featuring 11 competitions across coding, robotics, engineering exhibitions, dance, rock band, culinary arts, and treasure hunt.',
    startDate: '2027-02-05T08:50:00+05:30',
    endDate: '2027-02-06T20:00:00+05:30',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    isAccessibleForFree: true,
    image: [OG_IMAGE_URL],
    url: `${SITE_URL}/`,
    location: {
      '@type': 'Place',
      name: `${INSTITUTE_INFO.name} Campus`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: INSTITUTE_INFO.streetAddress,
        addressLocality: INSTITUTE_INFO.city,
        addressRegion: INSTITUTE_INFO.region,
        postalCode: INSTITUTE_INFO.postalCode,
        addressCountry: INSTITUTE_INFO.country,
      },
    },
    organizer: {
      '@id': `${SITE_URL}/#organization`,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: '2027-01-10T00:00:00+05:30',
      url: `${SITE_URL}/register`,
    },
  };
}

export function buildBreadcrumbJsonLd(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}
