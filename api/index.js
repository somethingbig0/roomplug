import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import sectionRouter from './routes/section.route.js';
import uploadRouter from './routes/upload.route.js';
import Listing from './models/listing.model.js';
import Section from './models/section.model.js';
import { ensureDefaultSections } from './controllers/section.controller.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../client/dist');
const templatePath = path.join(distPath, 'index.html');
const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://roomplug.onrender.com').replace(/\/$/, '');

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());

// Tell search engines not to index API responses.
app.use('/api', (req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  next();
});

// Serve uploaded files from api/uploads
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
      }
      if (filePath.endsWith('.mov')) {
        res.setHeader('Content-Type', 'video/quicktime');
      }
    },
  })
);

// API routes
app.use('/api/upload', uploadRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/section', sectionRouter);

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const escapeXml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const absoluteUrl = (route = '/') => `${SITE_URL}${route.startsWith('/') ? route : `/${route}`}`;

const buildDescription = (listing) => {
  const price = listing.offer ? listing.discountPrice : listing.regularPrice;
  const bits = [
    listing.description,
    listing.address ? `Located in ${listing.address}` : '',
    price ? `From $${Number(price).toLocaleString('en-US')} per month` : '',
    listing.bedrooms ? `${listing.bedrooms} bedroom${listing.bedrooms === 1 ? '' : 's'}` : '',
    listing.bathrooms ? `${listing.bathrooms} bathroom${listing.bathrooms === 1 ? '' : 's'}` : '',
    listing.distanceToCampus ? `${listing.distanceToCampus} from campus` : '',
  ].filter(Boolean);

  return bits.join('. ').replace(/\.\./g, '.').slice(0, 300);
};

const buildListingJsonLd = (listing) => {
  const roomUrl = absoluteUrl(`/listing/${listing._id}`);
  const sectionUrl = listing.section
    ? absoluteUrl(`/section/${listing.section}`)
    : absoluteUrl('/');

  const amenities = [
    ['Parking', listing.parking],
    ['Furnished', listing.furnished],
    ['WiFi', Boolean(listing.wifi)],
    ['Geyser', listing.geyser],
    ['Lounge', listing.lounge],
    ['Fitted kitchen', listing.fittedKitchen],
    ['Cleaning services', listing.cleaningServices],
    ['Refrigerator', listing.refrigerator],
    ['Microwave', listing.microwave],
    ['Wardrobes', listing.wardrobes],
    ['Study desk', listing.studyDesk],
    ['Swimming pool', listing.swimmingPool],
  ]
    .filter(([, value]) => Boolean(value))
    .map(([name]) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Accommodation',
        '@id': `${roomUrl}#accommodation`,
        name: listing.name,
        description: buildDescription(listing),
        url: roomUrl,
        image: listing.imageUrls || [],
        numberOfRooms: listing.bedrooms || undefined,
        occupancy: listing.roomAllocation
          ? {
              '@type': 'QuantitativeValue',
              value: listing.roomAllocation,
            }
          : undefined,
        address: {
          '@type': 'PostalAddress',
          addressLocality: listing.address || '',
          addressCountry: 'ZW',
        },
        amenityFeature: amenities,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'RoomPlug',
            item: absoluteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: listing.address || 'Accommodation',
            item: absoluteUrl(`/search?preferredLocation=${encodeURIComponent(listing.address || '')}`),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: listing.name,
            item: roomUrl,
          },
        ],
      },
    ],
  };
};

const buildSectionJsonLd = (section, listings, count) => {
  const sectionUrl = absoluteUrl(`/section/${section.slug}`);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': sectionUrl,
        url: sectionUrl,
        name: `${section.name} in Zimbabwe`,
        description: section.description || `Browse ${section.name.toLowerCase()} accommodation in Zimbabwe on RoomPlug.`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: count,
          itemListElement: listings.slice(0, 50).map((listing, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: absoluteUrl(`/listing/${listing._id}`),
            name: listing.name,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'RoomPlug',
            item: absoluteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: section.name,
            item: sectionUrl,
          },
        ],
      },
    ],
  };
};

const seoForPath = async (pathname) => {
  const defaultSeo = {
    statusCode: 200,
    title: 'RoomPlug | Student Accommodation in Zimbabwe',
    description:
      'Find student accommodation, lodges, general rooms and BnBs in Zimbabwe with RoomPlug. Browse room prices, locations, photos and short video tours.',
    canonical: absoluteUrl('/'),
    image: absoluteUrl('/favicon.svg'),
    robots: 'index,follow',
    type: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: 'RoomPlug',
          alternateName: 'Room Plug',
          url: `${SITE_URL}/`,
          logo: absoluteUrl('/favicon.svg'),
          description:
            'RoomPlug helps students and renters in Zimbabwe find accommodation through detailed room listings, photos and short video tours.',
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: `${SITE_URL}/`,
          name: 'RoomPlug',
          alternateName: 'Room Plug',
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
      ],
    },
  };

  if (pathname === '/') return defaultSeo;

  if (pathname === '/about') {
    return {
      ...defaultSeo,
      title: 'How RoomPlug Works | Student Accommodation in Zimbabwe',
      description:
        'Learn how RoomPlug helps students and renters find accommodation in Zimbabwe through detailed room listings, photos, video tours and a safer connection process.',
      canonical: absoluteUrl('/about'),
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'How RoomPlug Works',
        description:
          'How RoomPlug helps students and renters find accommodation in Zimbabwe.',
        url: absoluteUrl('/about'),
      },
    };
  }

  if (pathname === '/search' || pathname.startsWith('/search?')) {
    return {
      ...defaultSeo,
      title: 'Search Accommodation | RoomPlug',
      description:
        'Search RoomPlug accommodation by location, gender preference, room type, campus distance and furnishing.',
      canonical: absoluteUrl('/search'),
      robots: 'noindex,nofollow',
      jsonLd: null,
    };
  }

  const noindexPrefixes = [
    '/sign-in',
    '/sign-up',
    '/profile',
    '/admin',
    '/create-listing',
    '/update-listing',
  ];

  if (noindexPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return {
      ...defaultSeo,
      title: 'RoomPlug',
      description: 'RoomPlug accommodation platform.',
      canonical: absoluteUrl(pathname),
      robots: 'noindex,nofollow',
      jsonLd: null,
    };
  }

  if (pathname.startsWith('/section/')) {
    const slug = decodeURIComponent(pathname.split('/')[2] || '').trim().toLowerCase();
    const section = await Section.findOne({ slug, active: true }).lean();

    if (!section) {
      return {
        ...defaultSeo,
        statusCode: 404,
        title: 'Accommodation Section Not Found | RoomPlug',
        description: 'The RoomPlug accommodation section you requested was not found.',
        canonical: absoluteUrl(pathname),
        robots: 'noindex,nofollow',
        jsonLd: null,
      };
    }

    const filter = slug === 'general-accommodation'
      ? { $or: [{ section: slug }, { section: { $exists: false } }, { section: '' }, { section: null }] }
      : { section: slug };
    const count = await Listing.countDocuments(filter);
    const listings = await Listing.find(filter).sort({ createdAt: -1 }).limit(50).lean();
    const firstImage = listings.find((item) => item.imageUrls?.[0])?.imageUrls?.[0];

    return {
      ...defaultSeo,
      title: `${section.name} in Zimbabwe | RoomPlug`,
      description:
        `Browse ${count} ${section.name.toLowerCase()} listing${count === 1 ? '' : 's'} in Zimbabwe on RoomPlug. Compare locations, room prices, photos, amenities and availability.`,
      canonical: absoluteUrl(`/section/${section.slug}`),
      image: firstImage || absoluteUrl('/favicon.svg'),
      jsonLd: buildSectionJsonLd(section, listings, count),
    };
  }

  if (pathname.startsWith('/listing/')) {
    const id = pathname.split('/')[2];
    let listing;

    try {
      listing = await Listing.findById(id).lean();
    } catch {
      listing = null;
    }

    if (!listing) {
      return {
        ...defaultSeo,
        statusCode: 404,
        title: 'Accommodation Listing Not Found | RoomPlug',
        description: 'The RoomPlug accommodation listing you requested was not found.',
        canonical: absoluteUrl(pathname),
        robots: 'noindex,nofollow',
        jsonLd: null,
      };
    }

    return {
      ...defaultSeo,
      title: `${listing.name} in ${listing.address} | RoomPlug`,
      description: buildDescription(listing),
      canonical: absoluteUrl(`/listing/${listing._id}`),
      image: listing.imageUrls?.[0] || absoluteUrl('/favicon.svg'),
      jsonLd: buildListingJsonLd(listing),
    };
  }

  // Unknown frontend route: return an actual 404 instead of a soft-404 200.
  return {
    ...defaultSeo,
    statusCode: 404,
    title: 'Page Not Found | RoomPlug',
    description: 'The RoomPlug page you requested could not be found.',
    canonical: absoluteUrl(pathname),
    robots: 'noindex,nofollow',
    jsonLd: null,
  };
};

const renderHtml = async (req, res) => {
  const template = await fs.readFile(templatePath, 'utf8');
  const seo = await seoForPath(req.path);

  const meta = `
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    <meta name="robots" content="${escapeHtml(seo.robots)}" />
    <meta name="author" content="RoomPlug" />
    <link rel="canonical" href="${escapeHtml(seo.canonical)}" />
    <meta property="og:title" content="${escapeHtml(seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:type" content="${escapeHtml(seo.type || 'website')}" />
    <meta property="og:url" content="${escapeHtml(seo.canonical)}" />
    <meta property="og:site_name" content="RoomPlug" />
    <meta property="og:locale" content="en_ZW" />
    <meta property="og:image" content="${escapeHtml(seo.image || absoluteUrl('/favicon.svg'))}" />
    <meta property="og:image:alt" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    <meta name="twitter:image" content="${escapeHtml(seo.image || absoluteUrl('/favicon.svg'))}" />
    <meta name="theme-color" content="#38bdf8" />
    <script id="roomplug-structured-data" type="application/ld+json">${JSON.stringify(seo.jsonLd || {}).replace(/</g, '\\u003c')}</script>
  `.trim();

  let html = template.includes('<!-- SEO_HEAD -->'
    ? template.replace('<!-- SEO_HEAD -->', meta)
    : template.replace('</head>', `${meta}\n  </head>`));

  html = html.replace(
    /<title>RoomPlug \| Student Accommodation in Zimbabwe<\/title>\s*/i,
    ''
  );

  res.status(seo.statusCode || 200).send(html);
};

// robots.txt is intentionally generated from the same canonical-site setting as the sitemap.
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send([
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /admin',
    'Disallow: /profile',
    'Disallow: /create-listing',
    'Disallow: /update-listing/',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n'));
});

app.get('/sitemap.xml', async (req, res, next) => {
  try {
    await ensureDefaultSections();

    const [sections, listings] = await Promise.all([
      Section.find({ active: true }).sort({ displayOrder: 1, name: 1 }).lean(),
      Listing.find().sort({ updatedAt: -1 }).lean(),
    ]);

    const urls = [
      {
        loc: absoluteUrl('/'),
        lastmod: new Date().toISOString(),
      },
      {
        loc: absoluteUrl('/about'),
        lastmod: new Date().toISOString(),
      },
      ...sections.map((section) => ({
        loc: absoluteUrl(`/section/${section.slug}`),
        lastmod: section.updatedAt ? new Date(section.updatedAt).toISOString() : new Date().toISOString(),
      })),
      ...listings.map((listing) => ({
        loc: absoluteUrl(`/listing/${listing._id}`),
        lastmod: listing.updatedAt ? new Date(listing.updatedAt).toISOString() : new Date(listing.createdAt || Date.now()).toISOString(),
        image: listing.imageUrls?.[0] || '',
      })),
    ];

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
      ...urls.map((item) => {
        const imageXml = item.image
          ? `\n    <image:image><image:loc>${escapeXml(item.image)}</image:loc></image:image>`
          : '';
        return `  <url>\n    <loc>${escapeXml(item.loc)}</loc>\n    <lastmod>${escapeXml(item.lastmod)}</lastmod>${imageXml}\n  </url>`;
      }),
      '</urlset>',
    ].join('\n');

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=300');
    res.send(xml);
  } catch (error) {
    next(error);
  }
});

// Production frontend
app.use(express.static(distPath, {
  index: false,
  maxAge: '7d',
}));

// Dynamic SEO-aware SPA entrypoint
app.get('*', async (req, res, next) => {
  try {
    await renderHtml(req, res);
  } catch (error) {
    next(error);
  }
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
