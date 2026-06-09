import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    preferredLocation: 'all',
    gender: 'all',
    roomType: 'all',
    distanceFromCampus: 'all',
    furnished: 'all',
    sort: 'createdAt',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const getListingLocation = (listing) => {
    return (
      listing.location ||
      listing.address ||
      listing.area ||
      listing.city ||
      ''
    );
  };

  const getListingGender = (listing) => {
    return (
      listing.genderPreference ||
      listing.gender ||
      listing.preferredGender ||
      ''
    ).toLowerCase();
  };

  const getListingRoomType = (listing) => {
    return (
      listing.roomType ||
      listing.roomCategory ||
      listing.room ||
      ''
    ).toLowerCase();
  };

  const getListingDistance = (listing) => {
    return (
      listing.distanceFromCampus ||
      listing.campusDistance ||
      listing.distance ||
      ''
    ).toLowerCase();
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const searchTermFromUrl = urlParams.get('searchTerm');
    const preferredLocationFromUrl = urlParams.get('preferredLocation');
    const genderFromUrl = urlParams.get('gender');
    const roomTypeFromUrl = urlParams.get('roomType');
    const distanceFromCampusFromUrl = urlParams.get('distanceFromCampus');
    const furnishedFromUrl = urlParams.get('furnished');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    setSidebardata({
      searchTerm: searchTermFromUrl || '',
      preferredLocation: preferredLocationFromUrl || 'all',
      gender: genderFromUrl || 'all',
      roomType: roomTypeFromUrl || 'all',
      distanceFromCampus: distanceFromCampusFromUrl || 'all',
      furnished: furnishedFromUrl || 'all',
      sort: sortFromUrl || 'createdAt',
      order: orderFromUrl || 'desc',
    });

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);

      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();

      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }

      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const availableLocations = useMemo(() => {
    const locations = listings
      .map((listing) => getListingLocation(listing))
      .filter((item) => item && item.trim() !== '');

    return [...new Set(locations)].sort();
  }, [listings]);

  const filteredListings = useMemo(() => {
    let results = [...listings];

    if (sidebardata.preferredLocation !== 'all') {
      results = results.filter(
        (listing) =>
          getListingLocation(listing).toLowerCase() ===
          sidebardata.preferredLocation.toLowerCase()
      );
    }

    if (sidebardata.gender !== 'all') {
      results = results.filter((listing) =>
        getListingGender(listing).includes(sidebardata.gender)
      );
    }

    if (sidebardata.roomType !== 'all') {
      results = results.filter((listing) =>
        getListingRoomType(listing).includes(sidebardata.roomType)
      );
    }

    if (sidebardata.distanceFromCampus !== 'all') {
      results = results.filter((listing) =>
        getListingDistance(listing).includes(sidebardata.distanceFromCampus)
      );
    }

    if (sidebardata.furnished !== 'all') {
      const wantsFurnished = sidebardata.furnished === 'true';
      results = results.filter((listing) => listing.furnished === wantsFurnished);
    }

    return results;
  }, [listings, sidebardata]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (sidebardata.searchTerm.trim() !== '') count += 1;
    if (sidebardata.preferredLocation !== 'all') count += 1;
    if (sidebardata.gender !== 'all') count += 1;
    if (sidebardata.roomType !== 'all') count += 1;
    if (sidebardata.distanceFromCampus !== 'all') count += 1;
    if (sidebardata.furnished !== 'all') count += 1;

    return count;
  }, [sidebardata]);

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'preferredLocation' ||
      e.target.id === 'gender' ||
      e.target.id === 'roomType' ||
      e.target.id === 'distanceFromCampus' ||
      e.target.id === 'furnished'
    ) {
      setSidebardata({ ...sidebardata, [e.target.id]: e.target.value });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();

    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('preferredLocation', sidebardata.preferredLocation);
    urlParams.set('gender', sidebardata.gender);
    urlParams.set('roomType', sidebardata.roomType);
    urlParams.set('distanceFromCampus', sidebardata.distanceFromCampus);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);

    setShowMobileFilters(false);
    navigate(`/search?${urlParams.toString()}`);
  };

  const clearFilters = () => {
    setShowMobileFilters(false);
    navigate('/search');
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;

    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);

    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();

    if (data.length < 9) {
      setShowMore(false);
    }

    setListings([...listings, ...data]);
  };

  const FilterForm = () => (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 lg:gap-5'>
      <div>
        <label className='text-sm font-semibold text-slate-700'>
          Search keyword
        </label>
        <input
          type='text'
          id='searchTerm'
          placeholder='Search rooms, areas, campuses...'
          className='mt-2 border border-sky-100 bg-sky-50/60 rounded-2xl p-4 w-full outline-none focus:border-sky-400 focus:bg-white transition'
          value={sidebardata.searchTerm}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className='text-sm font-semibold text-slate-700'>
          Preferred location
        </label>
        <select
          id='preferredLocation'
          value={sidebardata.preferredLocation}
          onChange={handleChange}
          className='mt-2 border border-sky-100 bg-sky-50/60 rounded-2xl p-4 w-full outline-none focus:border-sky-400 focus:bg-white transition'
        >
          <option value='all'>All available locations</option>
          {availableLocations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className='text-sm font-semibold text-slate-700'>
          Gender preference
        </label>
        <select
          id='gender'
          value={sidebardata.gender}
          onChange={handleChange}
          className='mt-2 border border-sky-100 bg-sky-50/60 rounded-2xl p-4 w-full outline-none focus:border-sky-400 focus:bg-white transition'
        >
          <option value='all'>Any gender</option>
          <option value='girls'>Girls only</option>
          <option value='boys'>Boys only</option>
          <option value='mixed'>Mixed</option>
        </select>
      </div>

      <div>
        <label className='text-sm font-semibold text-slate-700'>
          Room type
        </label>
        <select
          id='roomType'
          value={sidebardata.roomType}
          onChange={handleChange}
          className='mt-2 border border-sky-100 bg-sky-50/60 rounded-2xl p-4 w-full outline-none focus:border-sky-400 focus:bg-white transition'
        >
          <option value='all'>Any room type</option>
          <option value='single'>Single room</option>
          <option value='shared'>Shared room</option>
          <option value='cottage'>Cottage</option>
          <option value='apartment'>Apartment</option>
          <option value='boarding'>Boarding house</option>
        </select>
      </div>

      <div>
        <label className='text-sm font-semibold text-slate-700'>
          Campus distance
        </label>
        <select
          id='distanceFromCampus'
          value={sidebardata.distanceFromCampus}
          onChange={handleChange}
          className='mt-2 border border-sky-100 bg-sky-50/60 rounded-2xl p-4 w-full outline-none focus:border-sky-400 focus:bg-white transition'
        >
          <option value='all'>Any distance</option>
          <option value='under 1km'>Under 1km</option>
          <option value='1-3km'>1–3km</option>
          <option value='3-5km'>3–5km</option>
          <option value='5km'>5km+</option>
        </select>
      </div>

      <div>
        <label className='text-sm font-semibold text-slate-700'>
          Furnishing
        </label>
        <select
          id='furnished'
          value={sidebardata.furnished}
          onChange={handleChange}
          className='mt-2 border border-sky-100 bg-sky-50/60 rounded-2xl p-4 w-full outline-none focus:border-sky-400 focus:bg-white transition'
        >
          <option value='all'>Any</option>
          <option value='true'>Furnished</option>
          <option value='false'>Not furnished</option>
        </select>
      </div>

      <div>
        <label className='text-sm font-semibold text-slate-700'>
          Sort rooms
        </label>
        <select
          id='sort_order'
          value={`${sidebardata.sort}_${sidebardata.order}`}
          onChange={handleChange}
          className='mt-2 border border-sky-100 bg-sky-50/60 rounded-2xl p-4 w-full outline-none focus:border-sky-400 focus:bg-white transition'
        >
          <option value='createdAt_desc'>Newest first</option>
          <option value='regularPrice_asc'>Price low to high</option>
          <option value='regularPrice_desc'>Price high to low</option>
          <option value='createdAt_asc'>Oldest first</option>
        </select>
      </div>

      <button className='bg-sky-400 text-white p-4 rounded-2xl uppercase font-semibold hover:bg-sky-500 transition shadow-lg shadow-sky-100'>
        Search rooms
      </button>

      <button
        type='button'
        onClick={clearFilters}
        className='border border-sky-200 text-sky-500 p-4 rounded-2xl font-semibold hover:bg-sky-50 transition'
      >
        Clear filters
      </button>
    </form>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50'>
      <div className='flex flex-col lg:flex-row'>
        {/* Desktop sidebar */}
        <aside className='hidden lg:block lg:w-[360px] border-r border-sky-100 bg-white/80 backdrop-blur-xl lg:min-h-screen'>
          <div className='sticky top-24 p-7'>
            <div className='mb-7'>
              <p className='text-sm font-semibold text-sky-500 uppercase tracking-[0.2em]'>
                RoomPlug Search
              </p>
              <h2 className='text-3xl font-bold text-slate-800 mt-2'>
                Find your room
              </h2>
              <p className='text-sm text-slate-500 mt-2 leading-6'>
                Filter verified rooms by location, gender preference and room style.
              </p>
            </div>

            <FilterForm />
          </div>
        </aside>

        {/* Results */}
        <main className='flex-1'>
          <div className='border-b border-sky-100 bg-white/80 backdrop-blur-xl px-4 sm:px-8 py-4 sm:py-8'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-xs sm:text-sm font-semibold text-sky-500 uppercase tracking-[0.18em]'>
                  Verified accommodation
                </p>
                <h1 className='text-2xl sm:text-4xl font-bold text-slate-800 mt-1 sm:mt-2'>
                  Available rooms
                </h1>
                <p className='text-slate-500 mt-2 text-sm sm:text-base'>
                  Browse rooms inspected and uploaded by the RoomPlug team.
                </p>
              </div>

              <button
                type='button'
                onClick={() => setShowMobileFilters(true)}
                className='lg:hidden shrink-0 bg-sky-400 text-white px-4 py-3 rounded-2xl font-semibold shadow-lg shadow-sky-100'
              >
                Filters
                {activeFilterCount > 0 && (
                  <span className='ml-2 bg-white text-sky-500 rounded-full px-2 py-0.5 text-xs'>
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile quick search bar */}
            <form onSubmit={handleSubmit} className='lg:hidden mt-4 flex gap-2'>
              <input
                type='text'
                id='searchTerm'
                placeholder='Search rooms...'
                className='border border-sky-100 bg-sky-50/70 rounded-2xl p-3 flex-1 outline-none focus:border-sky-400 focus:bg-white transition'
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />

              <button className='bg-sky-400 text-white px-4 rounded-2xl font-semibold'>
                Go
              </button>
            </form>
          </div>

          <div className='p-4 sm:p-8'>
            {!loading && filteredListings.length > 0 && (
              <p className='text-sm text-slate-500 mb-5'>
                Showing{' '}
                <span className='font-semibold text-slate-700'>
                  {filteredListings.length}
                </span>{' '}
                room{filteredListings.length === 1 ? '' : 's'}
              </p>
            )}

            {!loading && filteredListings.length === 0 && (
              <div className='bg-white border border-sky-100 rounded-3xl p-8 sm:p-10 text-center shadow-sm'>
                <h3 className='text-2xl font-bold text-slate-800'>
                  No rooms found
                </h3>
                <p className='text-slate-500 mt-3'>
                  Try another location, gender preference, or room type.
                </p>

                <button
                  type='button'
                  onClick={() => setShowMobileFilters(true)}
                  className='lg:hidden mt-5 bg-sky-400 text-white px-5 py-3 rounded-2xl font-semibold'
                >
                  Adjust filters
                </button>
              </div>
            )}

            {loading && (
              <div className='bg-white border border-sky-100 rounded-3xl p-8 sm:p-10 text-center shadow-sm'>
                <p className='text-xl text-slate-700'>Loading rooms...</p>
              </div>
            )}

            {!loading && filteredListings.length > 0 && (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {filteredListings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
              </div>
            )}

            {showMore && (
              <button
                onClick={onShowMoreClick}
                className='mt-10 text-sky-500 hover:text-sky-600 font-semibold text-center w-full'
              >
                Show more rooms
              </button>
            )}
          </div>
        </main>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className='lg:hidden fixed inset-0 z-50'>
          <div
            onClick={() => setShowMobileFilters(false)}
            className='absolute inset-0 bg-slate-900/40 backdrop-blur-sm'
          ></div>

          <div className='absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] max-h-[88vh] overflow-y-auto shadow-2xl'>
            <div className='sticky top-0 bg-white/95 backdrop-blur-xl border-b border-sky-100 p-5 rounded-t-[2rem] z-10'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <p className='text-xs font-semibold text-sky-500 uppercase tracking-[0.2em]'>
                    RoomPlug Search
                  </p>
                  <h2 className='text-2xl font-bold text-slate-800 mt-1'>
                    Filter rooms
                  </h2>
                </div>

                <button
                  type='button'
                  onClick={() => setShowMobileFilters(false)}
                  className='w-10 h-10 rounded-full bg-sky-50 text-slate-700 font-bold'
                >
                  ✕
                </button>
              </div>
            </div>

            <div className='p-5'>
              <FilterForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}