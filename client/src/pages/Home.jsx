import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import { FaArrowRight, FaBed, FaGraduationCap, FaHome, FaHotel, FaMapMarkedAlt, FaShieldAlt } from 'react-icons/fa';
import { usePageSEO, absoluteUrl } from '../components/SEO';

const SECTION_DEFINITIONS = [
  { slug: 'student-accommodation', name: 'Student Accommodation', description: 'Rooms near campus, shared houses and student-friendly spaces.', icon: FaGraduationCap, group: 'stay' },
  { slug: 'lodges', name: 'Lodges', description: 'Short stays, lodges and flexible accommodation.', icon: FaHotel, group: 'stay' },
  { slug: 'general-accommodation', name: 'General Accommodation', description: 'Rooms, flats and houses for regular tenants.', icon: FaHome, group: 'stay' },
  { slug: 'bnbs', name: 'BnBs', description: 'Comfortable short-stay places for flexible trips.', icon: FaBed, group: 'stay' },
  { slug: 'property-and-stands', name: 'Property & Stands', description: 'Browse property, land and stands to buy or list.', icon: FaMapMarkedAlt, group: 'property' },
];

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [sections, setSections] = useState([]);
  const [sectionsError, setSectionsError] = useState('');

  SwiperCore.use([Navigation]);

  usePageSEO({
    title: 'Accommodation, Property & Stands in Zimbabwe | RoomPlug',
    description: 'Choose what you need on RoomPlug: student accommodation, lodges, general accommodation, BnBs, or property and stands. Browse clear listings, prices, locations and photos in Zimbabwe.',
    canonicalPath: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', '@id': absoluteUrl('/#organization'), name: 'RoomPlug', alternateName: 'Room Plug', url: absoluteUrl('/'), logo: absoluteUrl('/favicon.svg'), description: 'RoomPlug is a Zimbabwean accommodation and property marketplace.' },
        { '@type': 'WebSite', '@id': absoluteUrl('/#website'), url: absoluteUrl('/'), name: 'RoomPlug', alternateName: 'Room Plug', publisher: { '@id': absoluteUrl('/#organization') } },
      ],
    },
  });

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch('/api/section/get');
        const data = await res.json();
        if (!res.ok || data.success === false) throw new Error(data.message || 'Failed to load sections');
        setSections(data);
        setSectionsError('');
      } catch (error) {
        setSectionsError(error.message || 'Sections could not be loaded');
      }
    };

    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) { console.log(error); }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=6');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) { console.log(error); }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) { console.log(error); }
    };

    fetchSections();
    fetchOfferListings();
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-float');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('scroll-float-show');
        else entry.target.classList.remove('scroll-float-show');
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -30px 0px' });
    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, [offerListings, rentListings, saleListings, sections]);

  const sectionMap = useMemo(() => Object.fromEntries(sections.map((section) => [section.slug, section])), [sections]);
  const sectionCards = useMemo(() => SECTION_DEFINITIONS.map((definition) => ({ ...definition, section: sectionMap[definition.slug] || null })), [sectionMap]);

  const howItWorks = [
    { number: '1', title: 'Choose your world', text: 'Tell RoomPlug what you need and we take you straight to the right marketplace.' },
    { number: '2', title: 'Compare clearly', text: 'See prices, locations, photos, availability and useful details without digging through menus.' },
    { number: '3', title: 'Move with confidence', text: 'Use RoomPlug to explore options and connect through the flow for that category.' },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50'>
      <section className='min-h-[calc(100dvh-76px)] w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 pt-6 sm:pt-10 pb-7 sm:pb-12 flex items-center'>
        <div className='w-full max-w-5xl mx-auto'>
          <div className='text-center max-w-2xl mx-auto'>
            <div className='inline-flex items-center gap-2 bg-white border border-sky-100 rounded-full px-4 py-2 shadow-sm'>
              <span className='h-2 w-2 rounded-full bg-sky-400 animate-pulse'></span>
              <span className='text-xs sm:text-sm font-semibold text-sky-600'>RoomPlug marketplace</span>
            </div>
            <h1 className='mt-5 text-[2.1rem] sm:text-5xl lg:text-6xl font-black tracking-[-0.045em] leading-[0.98] text-sky-950'>What are you looking for today?</h1>
            <p className='mt-3 text-sm sm:text-base text-sky-700/65 leading-6 max-w-xl mx-auto'>Pick one. RoomPlug will take you straight there.</p>
          </div>

          <div className='mt-6 sm:mt-8'>
            <p className='text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-sky-400 mb-3 px-1'>Find a place to stay</p>
            <div className='grid grid-cols-2 gap-3 sm:gap-4'>
              {sectionCards.filter((item) => item.group === 'stay').map((item) => {
                const Icon = item.icon;
                const count = item.section?.listingCount;
                return (
                  <Link key={item.slug} to={`/section/${item.slug}`} className='group min-h-[118px] sm:min-h-[145px] bg-white border border-sky-100 rounded-[24px] sm:rounded-[30px] p-4 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='h-11 w-11 sm:h-14 sm:w-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500'><Icon className='text-xl sm:text-2xl' /></div>
                      <FaArrowRight className='text-sky-300 mt-1.5 group-hover:translate-x-1 transition-transform' />
                    </div>
                    <div className='mt-4'>
                      <h2 className='font-extrabold text-sm sm:text-xl text-sky-950 leading-tight'>{item.name}</h2>
                      <p className='hidden sm:block text-sm text-sky-700/55 mt-1.5 line-clamp-2 leading-5'>{item.description}</p>
                      <p className='text-[11px] sm:text-xs text-sky-500 font-semibold mt-2'>{count === undefined ? 'Explore now' : `${count} available`}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className='mt-4'>
            <p className='text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-sky-400 mb-3 px-1'>Buy, browse or list property</p>
            {(() => {
              const item = sectionCards.find((entry) => entry.group === 'property');
              const Icon = item.icon;
              const count = item.section?.listingCount;
              return (
                <Link to={`/section/${item.slug}`} className='group block rounded-[26px] sm:rounded-[30px] bg-sky-950 border border-sky-900 p-5 sm:p-6 text-white shadow-xl shadow-sky-200/40 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300'>
                  <div className='flex items-center gap-4 sm:gap-5'>
                    <div className='h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-sky-200 shrink-0'><Icon className='text-xl sm:text-2xl' /></div>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-start justify-between gap-3'>
                        <h2 className='font-extrabold text-base sm:text-xl'>{item.name}</h2>
                        <FaArrowRight className='text-sky-300 mt-1 group-hover:translate-x-1 transition-transform shrink-0' />
                      </div>
                      <p className='text-xs sm:text-sm text-white/65 mt-1.5 leading-5'>{item.description}</p>
                      <p className='text-[11px] sm:text-xs text-sky-200 font-semibold mt-2'>{count === undefined ? 'Open property marketplace' : `${count} listings available`}</p>
                    </div>
                  </div>
                </Link>
              );
            })()}
          </div>

          <div className='mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] sm:text-xs font-semibold text-sky-700/55'>
            <span className='flex items-center gap-1.5'><FaShieldAlt className='text-sky-400' />Clear listings</span>
            <span>✓ Simple navigation</span>
            <span>✓ Zimbabwe focused</span>
          </div>
        </div>
      </section>

      {offerListings && offerListings.length > 0 && (
        <section className='w-full max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-12 py-10 sm:py-14'>
          <div className='scroll-float mb-5 flex items-end justify-between gap-4'>
            <div><p className='text-xs font-bold uppercase tracking-[0.2em] text-sky-400'>Featured</p><h2 className='text-2xl sm:text-3xl font-bold text-sky-950 mt-1'>Rooms worth seeing</h2></div>
            <Link className='text-sm text-sky-500 hover:text-sky-600 font-semibold' to='/search?offer=true'>View all</Link>
          </div>
          <div className='scroll-float rounded-[28px] sm:rounded-[36px] overflow-hidden border border-sky-100 shadow-sm'>
            <Swiper navigation>{offerListings.map((listing) => <SwiperSlide key={listing._id}><Link to={`/listing/${listing._id}`} className='block'><div style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover' }} className='h-[280px] sm:h-[420px] lg:h-[520px]'></div></Link></SwiperSlide>)}</Swiper>
          </div>
        </section>
      )}

      <section className='w-full max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-12 py-10 sm:py-14'>
        <div className='bg-white/85 border border-sky-100 rounded-[30px] sm:rounded-[36px] p-5 sm:p-8 lg:p-10 shadow-sm'>
          <div className='scroll-float mb-7 text-center'><p className='text-xs font-bold uppercase tracking-[0.22em] text-sky-400'>Simple by design</p><h2 className='text-2xl sm:text-3xl font-bold text-sky-950 mt-2'>How RoomPlug works</h2><p className='text-sky-700/60 mt-2 text-sm sm:text-base max-w-2xl mx-auto leading-6 sm:leading-7'>The site gets simpler after your first choice.</p></div>
          <div className='grid md:grid-cols-3 gap-4 sm:gap-5'>{howItWorks.map((item) => <div key={item.number} className='scroll-float bg-sky-50/70 rounded-[26px] sm:rounded-3xl p-5 sm:p-6 border border-sky-100 shadow-sm'><div className='h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-white flex items-center justify-center text-sky-500 font-bold text-sm sm:text-base shadow-sm'>{item.number}</div><h3 className='text-sky-950 font-bold text-lg sm:text-xl mt-4 sm:mt-5 leading-snug'>{item.title}</h3><p className='text-sky-700/65 text-sm sm:text-base mt-2.5 sm:mt-3 leading-6 sm:leading-7'>{item.text}</p></div>)}</div>
        </div>
      </section>

      {rentListings && rentListings.length > 0 && <section className='w-full max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-12 py-10 sm:py-14'><div className='scroll-float mb-6 flex items-end justify-between gap-4'><div><p className='text-xs font-bold uppercase tracking-[0.2em] text-sky-400'>Fresh listings</p><h2 className='text-2xl sm:text-3xl font-bold text-sky-950 mt-1'>Recently added rooms</h2><p className='text-sky-700/70 mt-1 text-sm sm:text-base'>New accommodation currently available on RoomPlug.</p></div><Link className='text-sm text-sky-500 hover:text-sky-600 font-semibold shrink-0' to='/section/student-accommodation'>Browse student rooms</Link></div><div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>{rentListings.map((listing) => <ListingItem listing={listing} key={listing._id} />)}</div></section>}

      {offerListings && offerListings.length > 0 && <section className='w-full max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-12 py-10 sm:py-14'><div className='scroll-float mb-6 flex items-end justify-between gap-4'><div><p className='text-xs font-bold uppercase tracking-[0.2em] text-sky-400'>Best picks</p><h2 className='text-2xl sm:text-3xl font-bold text-sky-950 mt-1'>Rooms people will notice</h2><p className='text-sky-700/70 mt-1 text-sm sm:text-base'>Price, location or convenience — something makes these stand out.</p></div><Link className='text-sm text-sky-500 hover:text-sky-600 font-semibold shrink-0' to='/search?offer=true'>View all</Link></div><div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>{offerListings.map((listing) => <ListingItem listing={listing} key={listing._id} />)}</div></section>}

      {saleListings && saleListings.length > 0 && <section className='w-full max-w-[1500px] mx-auto px-5 sm:px-6 lg:px-12 py-10 sm:py-14 pb-16'><div className='scroll-float mb-6 flex items-end justify-between gap-4'><div><p className='text-xs font-bold uppercase tracking-[0.2em] text-sky-400'>More on RoomPlug</p><h2 className='text-2xl sm:text-3xl font-bold text-sky-950 mt-1'>Other available spaces</h2><p className='text-sky-700/70 mt-1 text-sm sm:text-base'>Extra listings currently available.</p></div><Link className='text-sm text-sky-500 hover:text-sky-600 font-semibold shrink-0' to='/search?type=sale'>Show more</Link></div><div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>{saleListings.map((listing) => <ListingItem listing={listing} key={listing._id} />)}</div></section>}

      {sectionsError && <div className='max-w-3xl mx-auto px-5 pb-10'><p className='text-center text-xs text-sky-700/50'>Category counts are temporarily unavailable, but the navigation remains available.</p></div>}
    </div>
  );
}
