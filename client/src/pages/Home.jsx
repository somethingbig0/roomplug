import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import { FaArrowRight, FaBed, FaGraduationCap, FaHome, FaHotel } from 'react-icons/fa';
import { usePageSEO, absoluteUrl } from '../components/SEO';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [sections, setSections] = useState([]);
  const [sectionsError, setSectionsError] = useState('');

  SwiperCore.use([Navigation]);

  usePageSEO({
    title: 'Student Accommodation in Zimbabwe | RoomPlug',
    description:
      'Find student accommodation, rooms, lodges, general accommodation and BnBs in Zimbabwe. Browse verified room listings, prices, locations, photos and video tours on RoomPlug.',
    canonicalPath: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': absoluteUrl('/#organization'),
          name: 'RoomPlug',
          alternateName: 'Room Plug',
          url: absoluteUrl('/'),
          logo: absoluteUrl('/favicon.svg'),
          description:
            'RoomPlug helps students and renters in Zimbabwe find accommodation through detailed room listings, photos and short video tours.',
        },
        {
          '@type': 'WebSite',
          '@id': absoluteUrl('/#website'),
          url: absoluteUrl('/'),
          name: 'RoomPlug',
          alternateName: 'Room Plug',
          publisher: { '@id': absoluteUrl('/#organization') },
        },
      ],
    },
  });

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch('/api/section/get');
        const data = await res.json();
        if (!res.ok || data.success === false) {
          throw new Error(data.message || 'Failed to load sections');
        }
        setSections(data);
      } catch (error) {
        setSectionsError(error.message || 'Failed to load sections');
      }
    };

    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=6');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSections();
    fetchOfferListings();
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-float');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-float-show');
          } else {
            entry.target.classList.remove('scroll-float-show');
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [offerListings, rentListings, saleListings]);

  const howItWorks = [
    {
      number: '1',
      title: 'We inspect and upload',
      text: 'Our team checks rooms, takes clear photos, and records short video tours before listings go live.',
    },
    {
      number: '2',
      title: 'You browse safely',
      text: 'Compare rent, location, distance, transport, amenities and rules before contacting anyone.',
    },
    {
      number: '3',
      title: 'We help you connect',
      text: 'Choose a room, then RoomPlug helps confirm availability and connect you to the landlord.',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50'>
      {/* Hero Section */}
      <section className='w-full max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-12 pt-16 sm:pt-24 pb-12 sm:pb-20'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
          <div className='scroll-float flex flex-col gap-5 sm:gap-7'>
            <div className='w-fit bg-white border border-sky-100 rounded-full px-4 sm:px-5 py-2 shadow-sm'>
              <p className='text-sky-500 text-xs sm:text-sm font-semibold'>
                Verified student accommodation near campus
              </p>
            </div>

            <h1 className='font-bold tracking-[-0.055em] text-4xl sm:text-5xl lg:text-7xl leading-[0.95] text-sky-950'>
              Find your next{' '}
              <span className='bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text'>
                perfect room
              </span>
              <br />
              with RoomPlug
            </h1>

            <p className='text-sky-700/70 text-sm sm:text-lg max-w-2xl leading-7 sm:leading-8'>
              Browse clean, verified student rooms around UZ and nearby areas.
              We inspect rooms, collect photos and video tours ourselves, then
              help you secure access through a simple connection process.
            </p>

            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2'>
              <Link
                to='/search?type=rent'
                className='bg-sky-400 hover:bg-sky-500 text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold text-center shadow-lg shadow-sky-200'
              >
                Browse rooms
              </Link>

              <Link
                to='/about'
                className='bg-white hover:bg-sky-50 text-sky-600 border border-sky-100 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold text-center shadow-sm'
              >
                How RoomPlug works
              </Link>
            </div>
          </div>

          <div className='hidden lg:block'>
            <div className='scroll-float relative bg-white border border-sky-100 rounded-[40px] p-6 shadow-xl shadow-sky-100'>
              <div className='absolute -top-8 -right-8 w-32 h-32 bg-sky-200/50 rounded-full blur-3xl'></div>
              <div className='absolute -bottom-8 -left-8 w-32 h-32 bg-cyan-200/50 rounded-full blur-3xl'></div>

              <div className='relative rounded-[32px] overflow-hidden bg-sky-50'>
                {rentListings && rentListings.length > 0 ? (
                  <img
                    src={rentListings[0].imageUrls[0]}
                    alt='Student accommodation room in Zimbabwe' loading='eager' fetchPriority='high' decoding='async'
                    className='w-full h-[420px] object-cover'
                  />
                ) : (
                  <div className='w-full h-[420px] flex items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-50'>
                    <div className='text-center px-10'>
                      <h2 className='text-4xl font-bold text-sky-500'>
                        RoomPlug
                      </h2>
                      <p className='text-sky-600 mt-3'>
                        Your accommodation plug
                      </p>
                    </div>
                  </div>
                )}

                <div className='absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-lg border border-sky-100'>
                  <p className='text-sky-500 text-sm font-semibold'>
                    Verified room preview
                  </p>
                  <p className='text-sky-950 font-bold text-xl mt-1'>
                    Photos, room details and video tours
                  </p>
                  <p className='text-sky-700/70 text-sm mt-2'>
                    No exact address shown until access is handled through
                    RoomPlug.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className='w-full max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-12 py-8 sm:py-12'>
        <div className='bg-white/85 border border-sky-100 rounded-[28px] sm:rounded-[36px] p-5 sm:p-8 lg:p-10 shadow-sm'>
          <div className='scroll-float mb-6 sm:mb-8 text-center'>
            <p className='text-xs font-semibold uppercase tracking-[0.25em] text-sky-400'>
              Simple process
            </p>

            <h2 className='text-2xl sm:text-3xl font-bold text-sky-950 mt-2'>
              How RoomPlug works
            </h2>

            <p className='text-sky-700/60 mt-2 text-sm sm:text-base max-w-2xl mx-auto leading-6 sm:leading-7'>
              Verified rooms, clear previews, and a safer way to connect.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-4 sm:gap-5'>
            {howItWorks.map((item) => (
              <div
                key={item.number}
                className='scroll-float bg-sky-50/70 rounded-[26px] sm:rounded-3xl p-5 sm:p-6 border border-sky-100 shadow-sm'
              >
                <div className='h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-white flex items-center justify-center text-sky-500 font-bold text-sm sm:text-base shadow-sm'>
                  {item.number}
                </div>

                <h3 className='text-sky-950 font-bold text-lg sm:text-xl mt-4 sm:mt-5 leading-snug'>
                  {item.title}
                </h3>

                <p className='text-sky-700/65 text-sm sm:text-base mt-2.5 sm:mt-3 leading-6 sm:leading-7'>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accommodation sections */}
      <section className='w-full max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-12 py-12 sm:py-16'>
        <div className='scroll-float text-center max-w-3xl mx-auto mb-8'>
          <p className='text-xs font-semibold uppercase tracking-[0.25em] text-sky-400'>
            Choose your accommodation type
          </p>
          <h2 className='text-3xl sm:text-4xl font-bold text-sky-950 mt-2'>
            Browse RoomPlug sections
          </h2>
          <p className='text-sky-700/60 mt-3 leading-7'>
            Explore rooms by the type of accommodation you need. Each section has its own RoomPlug booking/connection fee.
          </p>
        </div>

        {sectionsError && (
          <p className='text-center text-red-600 text-sm mb-6'>{sectionsError}</p>
        )}

        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {sections.map((section, index) => {
            const icons = [FaGraduationCap, FaHotel, FaHome, FaBed];
            const Icon = icons[index % icons.length];

            return (
              <Link
                to={`/section/${section.slug}`}
                key={section.slug}
                className='scroll-float group bg-white border border-sky-100 rounded-[30px] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='h-14 w-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500'>
                    <Icon className='text-2xl' />
                  </div>
                  <FaArrowRight className='text-sky-300 mt-2 transition-transform group-hover:translate-x-1' />
                </div>

                <h3 className='text-xl font-bold text-sky-950 mt-6'>
                  {section.name}
                </h3>
                <p className='text-sky-700/60 text-sm mt-2 min-h-[48px] leading-6'>
                  {section.description || 'Browse available accommodation in this section.'}
                </p>

                <div className='mt-5 flex items-center justify-between gap-3'>
                  <p className='text-sm font-bold text-sky-500'>
                    {section.listingCount} {section.listingCount === 1 ? 'listing' : 'listings'} available
                  </p>
                  <p className='text-xs text-sky-700/60'>
                    {section.bookingFee > 0 ? `$${section.bookingFee} booking fee` : 'Fee not set'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured slider */}
      {offerListings && offerListings.length > 0 && (
        <section className='w-full max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-12 py-10 sm:py-12'>
          <div className='scroll-float mb-5 flex items-end justify-between gap-4'>
            <div>
              <h2 className='text-2xl sm:text-3xl font-bold text-sky-950'>
                Featured rooms
              </h2>
              <p className='text-sky-700/70 mt-1 text-sm sm:text-base'>
                Recently highlighted rooms from our verified listings.
              </p>
            </div>

            <Link
              className='text-sm text-sky-500 hover:text-sky-600 font-semibold'
              to='/search?offer=true'
            >
              Show more
            </Link>
          </div>

          <div className='scroll-float rounded-[28px] sm:rounded-[36px] overflow-hidden border border-sky-100 shadow-sm'>
            <Swiper navigation>
              {offerListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <div
                    style={{
                      background: `url(${listing.imageUrls[0]}) center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                    className='h-[300px] sm:h-[420px] lg:h-[520px]'
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Listing sections */}
      <section className='w-full max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-12 py-12 sm:py-16 flex flex-col gap-12 sm:gap-14'>
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='scroll-float mb-6 flex items-end justify-between gap-4'>
              <div>
                <h2 className='text-2xl sm:text-3xl font-bold text-sky-950'>
                  Recently added rooms
                </h2>
                <p className='text-sky-700/70 mt-1 text-sm sm:text-base'>
                  Fresh student accommodation options added by RoomPlug.
                </p>
              </div>

              <Link
                className='text-sm text-sky-500 hover:text-sky-600 font-semibold shrink-0'
                to='/search?type=rent'
              >
                Show more
              </Link>
            </div>

            <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='scroll-float mb-6 flex items-end justify-between gap-4'>
              <div>
                <h2 className='text-2xl sm:text-3xl font-bold text-sky-950'>
                  Best available picks
                </h2>
                <p className='text-sky-700/70 mt-1 text-sm sm:text-base'>
                  Rooms that stand out for location, price or convenience.
                </p>
              </div>

              <Link
                className='text-sm text-sky-500 hover:text-sky-600 font-semibold shrink-0'
                to='/search?offer=true'
              >
                View all
              </Link>
            </div>

            <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='scroll-float mb-6 flex items-end justify-between gap-4'>
              <div>
                <h2 className='text-2xl sm:text-3xl font-bold text-sky-950'>
                  Other available spaces
                </h2>
                <p className='text-sky-700/70 mt-1 text-sm sm:text-base'>
                  Extra listings currently available on RoomPlug.
                </p>
              </div>

              <Link
                className='text-sm text-sky-500 hover:text-sky-600 font-semibold shrink-0'
                to='/search?type=sale'
              >
                Show more
              </Link>
            </div>

            <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
