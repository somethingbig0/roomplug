import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
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

  return (
    <div className='min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50'>
      {/* Hero Section */}
      <section className='w-full max-w-[1500px] mx-auto px-6 lg:px-12 pt-24 pb-20'>
        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          <div className='scroll-float flex flex-col gap-7'>
            <div className='w-fit bg-white border border-sky-100 rounded-full px-5 py-2 shadow-sm'>
              <p className='text-sky-500 text-sm font-semibold'>
                Verified student accommodation near campus
              </p>
            </div>

            <h1 className='font-bold tracking-[-0.06em] text-4xl sm:text-5xl lg:text-7xl leading-[0.95] text-sky-950'>
              Find your next{' '}
              <span className='bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text'>
                perfect room
              </span>
              <br />
              with RoomPlug
            </h1>

            <p className='text-sky-700/70 text-base sm:text-lg max-w-2xl leading-8'>
              Browse clean, verified student rooms around UZ and nearby areas.
              We inspect rooms, collect photos and video tours ourselves, then
              help you secure access through a simple connection process.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 mt-2'>
              <Link
                to='/search?type=rent'
                className='bg-sky-400 hover:bg-sky-500 text-white px-8 py-4 rounded-full font-semibold text-center shadow-lg shadow-sky-200'
              >
                Browse rooms
              </Link>

              <Link
                to='/about'
                className='bg-white hover:bg-sky-50 text-sky-600 border border-sky-100 px-8 py-4 rounded-full font-semibold text-center shadow-sm'
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
                    alt='Room preview'
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
      <section className='w-full max-w-[1500px] mx-auto px-6 lg:px-12 py-12'>
        <div className='bg-white border border-sky-100 rounded-[36px] p-8 lg:p-10 shadow-sm'>
          <div className='scroll-float mb-8 text-center'>
            <h2 className='text-3xl font-bold text-sky-950'>
              How RoomPlug works
            </h2>
            <p className='text-sky-700/70 mt-2 max-w-3xl mx-auto'>
              We make student accommodation easier, safer and less stressful.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-5'>
            <div className='scroll-float bg-sky-50 rounded-3xl p-6 border border-sky-100 shadow-sm'>
              <div className='h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-sky-500 font-bold shadow-sm'>
                1
              </div>
              <h3 className='text-sky-950 font-bold text-xl mt-5'>
                We inspect and upload
              </h3>
              <p className='text-sky-700/70 mt-3 leading-7'>
                Our team visits available rooms, checks the place, takes clear
                photos and records a short video tour so students can preview
                the room before making a move.
              </p>
            </div>

            <div className='scroll-float bg-sky-50 rounded-3xl p-6 border border-sky-100 shadow-sm'>
              <div className='h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-sky-500 font-bold shadow-sm'>
                2
              </div>
              <h3 className='text-sky-950 font-bold text-xl mt-5'>
                You browse safely
              </h3>
              <p className='text-sky-700/70 mt-3 leading-7'>
                Students compare rent, deposit, room size, location area,
                distance to campus, transport options, amenities and house
                rules without needing to call random landlords first.
              </p>
            </div>

            <div className='scroll-float bg-sky-50 rounded-3xl p-6 border border-sky-100 shadow-sm'>
              <div className='h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-sky-500 font-bold shadow-sm'>
                3
              </div>
              <h3 className='text-sky-950 font-bold text-xl mt-5'>
                We help you connect
              </h3>
              <p className='text-sky-700/70 mt-3 leading-7'>
                Once you choose a room, RoomPlug helps confirm availability and
                connects you to the landlord after the access process, so you
                can secure the room with less stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured slider */}
      {offerListings && offerListings.length > 0 && (
        <section className='w-full max-w-[1500px] mx-auto px-6 lg:px-12 py-12'>
          <div className='scroll-float mb-5 flex items-end justify-between gap-4'>
            <div>
              <h2 className='text-3xl font-bold text-sky-950'>
                Featured rooms
              </h2>
              <p className='text-sky-700/70 mt-1'>
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

          <div className='scroll-float rounded-[36px] overflow-hidden border border-sky-100 shadow-sm'>
            <Swiper navigation>
              {offerListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <div
                    style={{
                      background: `url(${listing.imageUrls[0]}) center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                    className='h-[420px] lg:h-[520px]'
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Listing sections */}
      <section className='w-full max-w-[1500px] mx-auto px-6 lg:px-12 py-16 flex flex-col gap-14'>
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='scroll-float mb-6 flex items-end justify-between gap-4'>
              <div>
                <h2 className='text-3xl font-bold text-sky-950'>
                  Recently added rooms
                </h2>
                <p className='text-sky-700/70 mt-1'>
                  Fresh student accommodation options added by RoomPlug.
                </p>
              </div>

              <Link
                className='text-sm text-sky-500 hover:text-sky-600 font-semibold'
                to='/search?type=rent'
              >
                Show more rooms
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
                <h2 className='text-3xl font-bold text-sky-950'>
                  Best available picks
                </h2>
                <p className='text-sky-700/70 mt-1'>
                  Rooms that stand out for location, price or convenience.
                </p>
              </div>

              <Link
                className='text-sm text-sky-500 hover:text-sky-600 font-semibold'
                to='/search?offer=true'
              >
                View all picks
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
                <h2 className='text-3xl font-bold text-sky-950'>
                  Other available spaces
                </h2>
                <p className='text-sky-700/70 mt-1'>
                  Extra listings currently available on RoomPlug.
                </p>
              </div>

              <Link
                className='text-sm text-sky-500 hover:text-sky-600 font-semibold'
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