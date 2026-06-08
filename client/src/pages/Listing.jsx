import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaChevronLeft,
  FaChevronRight,
  FaWifi,
  FaWater,
  FaBolt,
  FaLock,
  FaPhoneAlt,
  FaEnvelope,
  FaUserShield,
  FaBus,
  FaWalking,
  FaDollarSign,
  FaHome,
  FaUsers,
  FaClock,
  FaDoorOpen,
  FaEdit,
  FaImage,
  FaVideo,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);

  const [listing, setListing] = useState(null);
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('');

  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const isAdmin = currentUser?.isAdmin === true;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setContact(false);

        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        setLoading(false);
        setError(false);

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        const res = await fetch('/api/listing/get?limit=100');
        const data = await res.json();

        if (data.success === false) {
          return;
        }

        setAllListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllListings();
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
        threshold: 0.16,
        rootMargin: '0px 0px -25px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [listing]);

  const currentIndex = allListings.findIndex(
    (item) => item._id === params.listingId
  );

  const previousListing =
    currentIndex > 0 ? allListings[currentIndex - 1] : null;

  const nextListing =
    currentIndex !== -1 && currentIndex < allListings.length - 1
      ? allListings[currentIndex + 1]
      : null;

  const handleRoomNavigate = (listingId, direction) => {
    setTransitionDirection(direction);

    setTimeout(() => {
      navigate(`/listing/${listingId}`);
      setTransitionDirection('');
    }, 280);
  };

  const amenityList = [
    { label: 'Parking', value: listing?.parking, icon: <FaParking /> },
    { label: 'Furnished', value: listing?.furnished, icon: <FaChair /> },
    { label: 'Geyser', value: listing?.geyser, icon: <FaWater /> },
    { label: 'Lounge', value: listing?.lounge, icon: <FaHome /> },
    {
      label: 'Fitted kitchen',
      value: listing?.fittedKitchen,
      icon: <FaHome />,
    },
    {
      label: 'Cleaning services',
      value: listing?.cleaningServices,
      icon: <FaHome />,
    },
    {
      label: 'Refrigerator',
      value: listing?.refrigerator,
      icon: <FaHome />,
    },
    { label: 'Microwave', value: listing?.microwave, icon: <FaHome /> },
    { label: 'Wardrobes', value: listing?.wardrobes, icon: <FaHome /> },
    { label: 'Study desk', value: listing?.studyDesk, icon: <FaHome /> },
    {
      label: 'Swimming pool',
      value: listing?.swimmingPool,
      icon: <FaWater />,
    },
  ];

  return (
    <main className='min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 overflow-x-hidden'>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}

      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}

      {listing && !loading && !error && (
        <>
          {/* Fixed buttons are OUTSIDE the animated wrapper so they stay centered on screen */}
          {previousListing && (
            <button
              type='button'
              onClick={() => handleRoomNavigate(previousListing._id, 'prev')}
              className='room-nav-button fixed left-3 sm:left-6 top-[50dvh] -translate-y-1/2 z-50 bg-white/90 backdrop-blur-xl border border-sky-100 shadow-xl shadow-sky-100 text-sky-500 h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center hover:bg-sky-50'
              title='Previous room'
            >
              <FaChevronLeft />
            </button>
          )}

          {nextListing && (
            <button
              type='button'
              onClick={() => handleRoomNavigate(nextListing._id, 'next')}
              className='room-nav-button fixed right-3 sm:right-6 top-[50dvh] -translate-y-1/2 z-50 bg-white/90 backdrop-blur-xl border border-sky-100 shadow-xl shadow-sky-100 text-sky-500 h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center hover:bg-sky-50'
              title='Next room'
            >
              <FaChevronRight />
            </button>
          )}

          <button
            className='fixed top-[13%] right-[3%] z-40 border border-sky-100 rounded-full w-12 h-12 flex justify-center items-center bg-white cursor-pointer shadow-sm hover:scale-110'
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
          >
            <FaShare className='text-sky-500' />
          </button>

          {copied && (
            <p className='fixed top-[23%] right-[5%] z-40 rounded-md bg-white border border-sky-100 p-2 text-sky-600 shadow-sm'>
              Link copied!
            </p>
          )}

          {isAdmin && (
            <Link
              to={`/update-listing/${listing._id}`}
              className='fixed bottom-6 right-6 z-40 bg-white border border-sky-100 shadow-xl shadow-sky-100 text-sky-500 h-14 w-14 rounded-full flex items-center justify-center hover:scale-110 hover:bg-sky-50'
              title='Edit room'
            >
              <FaEdit />
            </Link>
          )}

          <div
            className={`room-page-transition w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-10 overflow-x-hidden ${
              transitionDirection === 'next'
                ? 'room-slide-left'
                : transitionDirection === 'prev'
                ? 'room-slide-right'
                : ''
            }`}
          >
            {/* Primary room information FIRST */}
            <section className='scroll-float bg-white border border-sky-100 rounded-[32px] p-5 sm:p-6 lg:p-8 shadow-sm mb-8 flex flex-col gap-6 max-w-6xl mx-auto'>
              <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5'>
                <div>
                  <p className='text-2xl sm:text-4xl font-bold text-sky-950 leading-tight'>
                    {listing.name}
                  </p>

                  <p className='flex items-center gap-2 text-sky-700 text-sm mt-3'>
                    <FaMapMarkerAlt className='text-sky-400' />
                    {listing.address}
                  </p>
                </div>

                <div className='bg-sky-50 border border-sky-100 rounded-[28px] p-5 min-w-[240px]'>
                  <p className='text-sky-700/60 text-sm'>Monthly rent</p>
                  <p className='text-3xl font-bold text-sky-500 mt-1'>
                    $
                    {listing.offer
                      ? listing.discountPrice.toLocaleString('en-US')
                      : listing.regularPrice.toLocaleString('en-US')}
                    <span className='text-base text-sky-700/60 font-medium'>
                      {' '}
                      / month
                    </span>
                  </p>

                  {listing.nonRefundableDeposit > 0 && (
                    <p className='text-sm text-sky-700/70 mt-3'>
                      Deposit to secure room:{' '}
                      <span className='font-bold text-sky-950'>
                        ${listing.nonRefundableDeposit.toLocaleString('en-US')}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className='flex gap-3 flex-wrap'>
                <p className='bg-sky-400 min-w-[130px] text-white text-center px-4 py-2 rounded-full'>
                  {listing.type === 'rent' ? 'For Rent' : 'Available'}
                </p>

                {listing.offer && (
                  <p className='bg-cyan-400 min-w-[130px] text-white text-center px-4 py-2 rounded-full'>
                    ${+listing.regularPrice - +listing.discountPrice} OFF
                  </p>
                )}

                <p className='bg-white border border-sky-100 text-sky-500 min-w-[130px] text-center px-4 py-2 rounded-full'>
                  Verified
                </p>

                {listing.genderAllowed && (
                  <p className='bg-sky-50 border border-sky-100 text-sky-600 min-w-[130px] text-center px-4 py-2 rounded-full capitalize'>
                    {listing.genderAllowed}
                  </p>
                )}

                {listing.distanceToCampus && (
                  <p className='bg-sky-50 border border-sky-100 text-sky-600 min-w-[130px] text-center px-4 py-2 rounded-full'>
                    {listing.distanceToCampus}
                  </p>
                )}
              </div>

              <p className='text-sky-800/80 leading-8'>
                <span className='font-semibold text-sky-950'>
                  Description -{' '}
                </span>
                {listing.description}
              </p>

              <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-3'>
                <InfoPill
                  icon={<FaBed />}
                  title='Beds'
                  value={
                    listing.bedrooms > 1
                      ? `${listing.bedrooms} beds`
                      : `${listing.bedrooms} bed`
                  }
                />

                <InfoPill
                  icon={<FaBath />}
                  title='Bathrooms'
                  value={
                    listing.bathrooms > 1
                      ? `${listing.bathrooms} baths`
                      : `${listing.bathrooms} bath`
                  }
                />

                <InfoPill
                  icon={<FaUsers />}
                  title='Room allocation'
                  value={`Room of ${listing.roomAllocation || 1}`}
                />

                <InfoPill
                  icon={<FaHome />}
                  title='Room space'
                  value={listing.spaceLevel || 'Not specified'}
                />
              </div>
            </section>

            {/* Pictures SECOND */}
            <section className='scroll-float max-w-6xl mx-auto mb-8'>
              <div className='flex flex-col items-center text-center gap-3 mb-5 px-1'>
                <div className='h-12 w-12 bg-white border border-sky-100 rounded-2xl flex items-center justify-center text-sky-500 shadow-sm'>
                  <FaImage />
                </div>

                <div>
                  <h2 className='text-2xl sm:text-3xl font-bold text-sky-950'>
                    Pictures
                  </h2>
                  <p className='text-sky-700/60 text-sm mt-1'>
                    Swipe through the room photos.
                  </p>
                </div>
              </div>

              <div className='w-full min-w-0 bg-white border border-sky-100 rounded-[32px] p-3 sm:p-4 shadow-sm overflow-hidden'>
                <Swiper
                  navigation
                  className='w-full max-w-full overflow-hidden rounded-[26px]'
                >
                  {listing.imageUrls.map((url) => (
                    <SwiperSlide key={url} className='w-full'>
                      <div className='w-full bg-sky-50 rounded-[26px] overflow-hidden flex items-center justify-center'>
                        <img
                          src={url}
                          alt='room'
                          className='w-full h-[280px] sm:h-[380px] lg:h-[540px] object-cover rounded-[26px]'
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>

            {/* Video THIRD */}
            <section className='scroll-float max-w-6xl mx-auto mb-8'>
              <div className='flex flex-col items-center text-center gap-3 mb-5 px-1'>
                <div className='h-12 w-12 bg-white border border-sky-100 rounded-2xl flex items-center justify-center text-sky-500 shadow-sm'>
                  <FaVideo />
                </div>

                <div>
                  <h2 className='text-2xl sm:text-3xl font-bold text-sky-950'>
                    Short video preview
                  </h2>
                  <p className='text-sky-700/60 text-sm mt-1'>
                    Quick room tour before you secure access.
                  </p>
                </div>
              </div>

              <div className='w-full min-w-0 bg-white border border-sky-100 rounded-[32px] p-3 sm:p-4 shadow-sm overflow-hidden'>
                {listing.videoUrl ? (
                  <video
                    src={listing.videoUrl}
                    controls
                    className='w-full h-[280px] sm:h-[380px] lg:h-[540px] object-cover rounded-[26px] bg-sky-50'
                  />
                ) : (
                  <div className='w-full h-[280px] sm:h-[380px] lg:h-[540px] rounded-[26px] bg-sky-50 flex items-center justify-center text-center p-8'>
                    <div>
                      <p className='text-sky-500 font-bold text-xl'>
                        No video tour yet
                      </p>
                      <p className='text-sky-700/60 mt-2'>
                        A short preview video will appear here when uploaded.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Campus distance and transport */}
            <section className='scroll-float bg-white border border-sky-100 rounded-[32px] p-5 sm:p-6 lg:p-8 shadow-sm my-8 max-w-6xl mx-auto'>
              <h2 className='text-2xl font-bold text-sky-950 text-center'>
                Campus distance and transport
              </h2>

              <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5'>
                <InfoPill
                  icon={<FaMapMarkerAlt />}
                  title='Distance'
                  value={listing.distanceToCampus || 'Not specified'}
                />

                <InfoPill
                  icon={<FaClock />}
                  title='Time to campus'
                  value={listing.timeToCampus || 'Not specified'}
                />

                <InfoPill
                  icon={
                    listing.transportType === 'walkable' ? (
                      <FaWalking />
                    ) : (
                      <FaBus />
                    )
                  }
                  title='Transport'
                  value={listing.transportType || 'Not specified'}
                />

                <InfoPill
                  icon={<FaDollarSign />}
                  title='Transport cost'
                  value={
                    listing.transportCost > 0
                      ? `$${listing.transportCost}`
                      : 'Not specified'
                  }
                />
              </div>
            </section>

            {/* Utilities */}
            <section className='scroll-float bg-white border border-sky-100 rounded-[32px] p-5 sm:p-6 lg:p-8 shadow-sm my-8 max-w-6xl mx-auto'>
              <h2 className='text-2xl font-bold text-sky-950 text-center'>
                Utilities and property features
              </h2>

              <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5'>
                <InfoPill
                  icon={<FaWifi />}
                  title='WiFi'
                  value={listing.wifi || 'Not specified'}
                />

                <InfoPill
                  icon={<FaBolt />}
                  title='Power backup'
                  value={listing.zesaBackup || 'Not specified'}
                />

                <InfoPill
                  icon={<FaWater />}
                  title='Water'
                  value={listing.waterSource || 'Not specified'}
                />

                <InfoPill
                  icon={<FaUserShield />}
                  title='Security'
                  value={listing.security || 'Not specified'}
                />

                <InfoPill
                  icon={<FaHome />}
                  title='Cooking'
                  value={listing.cookingType || 'Not specified'}
                />
              </div>

              <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5'>
                {amenityList.map((item) => (
                  <div
                    key={item.label}
                    className={`border rounded-2xl px-4 py-3 flex items-center gap-3 ${
                      item.value
                        ? 'bg-sky-50 border-sky-100 text-sky-700'
                        : 'bg-white border-sky-50 text-sky-700/40'
                    }`}
                  >
                    <span className='text-sky-400'>{item.icon}</span>
                    <span className='text-sm font-semibold'>{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* House rules */}
            <section className='scroll-float bg-white border border-sky-100 rounded-[32px] p-5 sm:p-6 lg:p-8 shadow-sm my-8 max-w-6xl mx-auto'>
              <h2 className='text-2xl font-bold text-sky-950 text-center'>
                House rules
              </h2>

              <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5'>
                <InfoPill
                  icon={<FaClock />}
                  title='Curfew'
                  value={
                    listing.curfew === 'yes'
                      ? `Yes${
                          listing.curfewTime ? `, ${listing.curfewTime}` : ''
                        }`
                      : 'No curfew'
                  }
                />

                <InfoPill
                  icon={<FaDoorOpen />}
                  title='Visitors'
                  value={listing.visitorsAllowed || 'Not specified'}
                />

                <InfoPill
                  icon={<FaUsers />}
                  title='Visitor rules'
                  value={listing.visitorsGender || 'Not specified'}
                />

                <InfoPill
                  icon={<FaUsers />}
                  title='Gender'
                  value={listing.genderAllowed || 'Any gender'}
                />
              </div>
            </section>

            {/* Hidden landlord/access section */}
            <section className='scroll-float bg-white border border-sky-100 rounded-[32px] p-5 sm:p-6 lg:p-8 shadow-sm my-8 max-w-6xl mx-auto'>
              <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
                <div>
                  <h2 className='text-2xl font-bold text-sky-950 text-center lg:text-left'>
                    Secure this room
                  </h2>

                  <p className='text-sky-700/70 mt-3 leading-7 max-w-3xl text-center lg:text-left'>
                    RoomPlug hides the landlord’s contact details and exact
                    address until the connection process is handled. The
                    connection fee helps us confirm availability and connect you
                    to the landlord safely.
                  </p>

                  <div className='flex items-center justify-center lg:justify-start gap-2 mt-4 text-sky-500 font-semibold'>
                    <FaLock />
                    <span>
                      Landlord details are locked until access is approved.
                    </span>
                  </div>
                </div>

                {currentUser &&
                  listing.userRef !== currentUser._id &&
                  !contact && (
                    <button
                      onClick={() => setContact(true)}
                      className='bg-sky-400 text-white rounded-full uppercase hover:bg-sky-500 p-4 px-8 shadow-lg shadow-sky-100 min-w-fit'
                    >
                      Secure this room
                    </button>
                  )}
              </div>

              {contact && <Contact listing={listing} />}

              {isAdmin && (
                <div className='mt-8 bg-sky-50 border border-sky-100 rounded-[28px] p-5'>
                  <h3 className='text-xl font-bold text-sky-950 text-center'>
                    Admin-only landlord details
                  </h3>

                  <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4'>
                    <InfoPill
                      icon={<FaUserShield />}
                      title='Landlord'
                      value={listing.landlordName || 'Not specified'}
                    />

                    <InfoPill
                      icon={<FaPhoneAlt />}
                      title='Phone'
                      value={listing.landlordPhone || 'Not specified'}
                    />

                    <InfoPill
                      icon={<FaEnvelope />}
                      title='Email'
                      value={listing.landlordEmail || 'Not specified'}
                    />

                    <InfoPill
                      icon={<FaMapMarkerAlt />}
                      title='Exact address'
                      value={listing.exactAddress || 'Not specified'}
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </main>
  );
}

function InfoPill({ icon, title, value }) {
  return (
    <div className='bg-sky-50 border border-sky-100 rounded-2xl px-4 py-3 flex items-start gap-3 min-h-[78px]'>
      <span className='text-sky-400 mt-1'>{icon}</span>

      <div className='min-w-0'>
        <p className='text-xs text-sky-700/50'>{title}</p>
        <p className='text-sm font-semibold text-sky-900 break-words'>
          {value}
        </p>
      </div>
    </div>
  );
}