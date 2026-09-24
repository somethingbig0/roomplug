import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { usePageSEO, absoluteUrl } from '../components/SEO';

export default function Section() {
  const { slug } = useParams();
  const [section, setSection] = useState(null);
  const [listings, setListings] = useState([]);
  const [listingCount, setListingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  usePageSEO({
    title: section
      ? `${section.name} in Zimbabwe | RoomPlug`
      : 'Accommodation in Zimbabwe | RoomPlug',
    description: section
      ? `Browse ${listingCount} ${section.name.toLowerCase()} listing${listingCount === 1 ? '' : 's'} in Zimbabwe on RoomPlug. Compare locations, room prices, photos, amenities and availability.`
      : 'Browse accommodation listings in Zimbabwe on RoomPlug.',
    canonicalPath: slug ? `/section/${slug}` : '/',
    image: listings?.[0]?.imageUrls?.[0] || '/favicon.svg',
    jsonLd: section
      ? {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CollectionPage',
              '@id': absoluteUrl(`/section/${section.slug}`),
              url: absoluteUrl(`/section/${section.slug}`),
              name: `${section.name} in Zimbabwe`,
              description: section.description,
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: listingCount,
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
                  item: absoluteUrl(`/section/${section.slug}`),
                },
              ],
            },
          ],
        }
      : null,
  });

  useEffect(() => {
    const fetchSection = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`/api/section/get/${slug}`);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.message || 'Failed to load section');
        }

        setSection(data.section);
        setListings(data.listings || []);
        setListingCount(Number(data.count) || 0);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [slug]);

  if (loading) {
    return (
      <main className='min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 flex items-center justify-center px-4'>
        <p className='text-xl text-sky-700'>Loading accommodation...</p>
      </main>
    );
  }

  if (error || !section) {
    return (
      <main className='min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 flex items-center justify-center px-4'>
        <div className='bg-white border border-sky-100 rounded-[32px] p-8 max-w-lg w-full text-center shadow-sm'>
          <h1 className='text-2xl font-bold text-sky-950'>Section unavailable</h1>
          <p className='text-sky-700/70 mt-3'>{error || 'This section could not be found.'}</p>
          <Link
            to='/'
            className='inline-block mt-6 bg-sky-400 text-white px-6 py-3 rounded-full hover:bg-sky-500'
          >
            Back to RoomPlug
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50'>
      <section className='max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-12 py-10 sm:py-14'>
        <div className='bg-white border border-sky-100 rounded-[34px] shadow-sm p-6 sm:p-8 lg:p-10'>
          <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7'>
            <div className='max-w-3xl'>
              <p className='text-xs font-semibold uppercase tracking-[0.25em] text-sky-400'>
                RoomPlug section
              </p>
              <h1 className='text-3xl sm:text-5xl font-bold text-sky-950 mt-2 capitalize'>
                {section.name}
              </h1>
              <p className='text-sky-700/70 mt-4 leading-7 text-sm sm:text-base'>
                {section.description}
              </p>
            </div>

            <div className='bg-sky-50 border border-sky-100 rounded-[28px] p-5 min-w-[260px]'>
              <p className='text-sm text-sky-700/60'>Available now</p>
              <p className='text-4xl font-bold text-sky-500 mt-1'>
                {listingCount}
              </p>
              <p className='text-sm text-sky-700/70 mt-1'>
                {listingCount === 1 ? 'listing' : 'listings'} available
              </p>
              <p className='text-sm font-semibold text-sky-950 mt-4'>
                {section.bookingFee > 0
                  ? `$${section.bookingFee} RoomPlug booking / connection fee`
                  : 'RoomPlug booking / connection fee not set yet'}
              </p>
            </div>
          </div>

          <div className='flex flex-wrap gap-3 mt-8'>
            <Link
              to={`/search?section=${section.slug}`}
              className='bg-sky-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-sky-500'
            >
              Search this section
            </Link>
            <Link
              to='/'
              className='border border-sky-200 text-sky-500 px-6 py-3 rounded-full font-semibold hover:bg-sky-50'
            >
              All accommodation sections
            </Link>
          </div>
        </div>

        <div className='mt-10'>
          {listings.length === 0 ? (
            <div className='bg-white border border-sky-100 rounded-[32px] p-10 text-center shadow-sm'>
              <h2 className='text-2xl font-bold text-sky-950'>No listings yet</h2>
              <p className='text-sky-700/60 mt-3'>
                New rooms will appear here as soon as an admin publishes them in this section.
              </p>
            </div>
          ) : (
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
