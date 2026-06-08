import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { useEffect, useRef, useState } from 'react';

export default function ListingItem({ listing }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.22,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentCard = cardRef.current;

    if (currentCard) {
      observer.observe(currentCard);
    }

    return () => {
      if (currentCard) {
        observer.unobserve(currentCard);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`room-card-scroll group bg-white border border-sky-100 shadow-sm hover:shadow-2xl hover:shadow-sky-100 rounded-[32px] overflow-hidden w-full sm:w-[330px] p-3 ${
        isVisible ? 'room-card-show' : ''
      }`}
    >
      <Link to={`/listing/${listing._id}`} className='block'>
        <div className='bg-sky-50 rounded-[26px] p-3 overflow-hidden'>
          <img
            src={
              listing.imageUrls[0] ||
              'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
            }
            alt='listing cover'
            className='h-[230px] sm:h-[190px] w-full object-cover rounded-[22px] group-hover:scale-[1.035] transition-transform duration-700 ease-out'
          />
        </div>

        <div className='px-2 pt-5 pb-3 flex flex-col gap-3 w-full'>
          <div className='flex items-start justify-between gap-3'>
            <p className='truncate text-lg font-bold text-sky-950'>
              {listing.name}
            </p>

            <span className='bg-sky-50 text-sky-500 text-[11px] font-semibold px-3 py-1 rounded-full border border-sky-100 min-w-fit'>
              Verified
            </span>
          </div>

          <div className='flex items-center gap-1.5'>
            <MdLocationOn className='h-4 w-4 text-sky-400 min-w-fit' />
            <p className='text-sm text-sky-700/70 truncate w-full'>
              {listing.address}
            </p>
          </div>

          <p className='text-sm text-sky-700/60 line-clamp-2 leading-6'>
            {listing.description}
          </p>

          <div className='flex items-end justify-between gap-3 mt-1'>
            <p className='text-sky-500 font-bold text-lg'>
              $
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && (
                <span className='text-sky-700/50 text-sm font-medium'>
                  {' '}
                  / month
                </span>
              )}
            </p>
          </div>

          <div className='flex gap-2 flex-wrap pt-1'>
            <span className='bg-sky-50 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-sky-100'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </span>

            <span className='bg-sky-50 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-sky-100'>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </span>

            {listing.furnished && (
              <span className='bg-sky-50 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-sky-100'>
                Furnished
              </span>
            )}

            {listing.parking && (
              <span className='bg-sky-50 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-sky-100'>
                Parking
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}