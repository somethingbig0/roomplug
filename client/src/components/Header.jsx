import {
  FaBars,
  FaChevronDown,
  FaChevronRight,
  FaGraduationCap,
  FaHotel,
  FaBed,
  FaHome,
  FaMapMarkedAlt,
  FaSearch,
  FaTachometerAlt,
  FaTimes,
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import logoLight from '../assets/roomplug-logo.png';
import logoDark from '../assets/roomplug-logo-dark.png';

const CATEGORY_OPTIONS = [
  { slug: 'student-accommodation', name: 'Student Accommodation', description: 'Rooms near campus, shared houses and student-friendly spaces.', icon: FaGraduationCap },
  { slug: 'lodges', name: 'Lodges', description: 'Short stays, lodges and flexible accommodation.', icon: FaHotel },
  { slug: 'general-accommodation', name: 'General Accommodation', description: 'Rooms, flats and houses for regular tenants.', icon: FaHome },
  { slug: 'bnbs', name: 'BnBs', description: 'Comfortable short-stay places for flexible trips.', icon: FaBed },
  { slug: 'property-and-stands', name: 'Property & Stands', description: 'Browse property, land and stands to buy or list.', icon: FaMapMarkedAlt },
];

const getCategoryFromLocation = (location) => {
  const sectionMatch = location.pathname.match(/^\/section\/([^/]+)/);
  const searchParams = new URLSearchParams(location.search);
  const slug = sectionMatch?.[1] || searchParams.get('section');
  if (!slug) return null;
  return CATEGORY_OPTIONS.find((item) => item.slug === slug) || null;
};

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const category = useMemo(() => getCategoryFromLocation(location), [location.pathname, location.search]);
  const isHome = location.pathname === '/';
  const searchTarget = category ? `/search?section=${encodeURIComponent(category.slug)}` : '/search';

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = '';
      return undefined;
    }
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const goToCategory = (slug) => {
    setMenuOpen(false);
    navigate(`/section/${slug}`);
  };

  return (
    <>
      <header className='bg-white/95 backdrop-blur-xl sticky top-0 z-50 border-b border-sky-100'>
        <div className='flex items-center justify-between gap-3 w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 py-2.5'>
          <div className='flex items-center gap-2 sm:gap-4 min-w-0'>
            <Link to='/' className='flex items-center min-w-fit'>
              <img src={logoLight} alt='RoomPlug' className='h-10 sm:h-12 w-auto object-contain roomplug-logo-light' />
              <img src={logoDark} alt='RoomPlug' className='h-10 sm:h-12 w-auto object-contain roomplug-logo-dark hidden' />
            </Link>
            {category && (
              <button
                type='button'
                onClick={() => setMenuOpen(true)}
                className='hidden sm:flex items-center gap-2 max-w-[330px] border border-sky-100 bg-sky-50/80 hover:bg-sky-100/80 text-sky-700 rounded-full px-3.5 py-2 text-sm font-semibold transition'
                aria-label={`Switch from ${category.name}`}
              >
                <category.icon className='text-sky-400 shrink-0' />
                <span className='truncate'>{category.name}</span>
                <FaChevronDown className='text-[10px] text-sky-400 shrink-0' />
              </button>
            )}
          </div>

          <div className='flex items-center gap-1.5 sm:gap-2'>
            {!isHome && (
              <Link
                to={searchTarget}
                aria-label={category ? `Search ${category.name}` : 'Search RoomPlug'}
                className='h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-sky-100 bg-white hover:bg-sky-50 flex items-center justify-center text-sky-500 transition'
                title={category ? `Search ${category.name}` : 'Search'}
              >
                <FaSearch />
              </Link>
            )}
            {currentUser ? (
              <Link to='/profile' className='hidden sm:block'>
                <img className='rounded-full h-10 w-10 object-cover border-2 border-sky-100 shadow-sm hover:scale-105' src={currentUser.avatar} alt='Profile' />
              </Link>
            ) : (
              <Link to='/sign-in' className='hidden sm:inline-flex text-white bg-sky-400 hover:bg-sky-500 transition px-4 py-2.5 rounded-full text-sm font-semibold shadow-sm shadow-sky-100'>
                Sign in
              </Link>
            )}
            <button
              type='button'
              onClick={() => setMenuOpen(true)}
              className='h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-sky-50 border border-sky-100 text-sky-600 hover:bg-sky-100 flex items-center justify-center transition shadow-sm'
              aria-label='Open RoomPlug navigation menu'
              aria-expanded={menuOpen}
            >
              <FaBars />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className='fixed inset-0 z-[90]' role='dialog' aria-modal='true'>
          <button type='button' onClick={() => setMenuOpen(false)} className='absolute inset-0 bg-slate-950/35 backdrop-blur-[2px] cursor-default' aria-label='Close navigation menu' />
          <aside className='absolute top-0 right-0 h-full w-full sm:max-w-[430px] bg-white border-l border-sky-100 shadow-2xl flex flex-col overflow-hidden'>
            <div className='flex items-center justify-between gap-4 px-5 sm:px-7 py-4 border-b border-sky-100'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.22em] text-sky-400'>RoomPlug</p>
                <h2 className='text-xl font-bold text-sky-950 mt-1'>Navigate</h2>
              </div>
              <button type='button' onClick={() => setMenuOpen(false)} className='h-11 w-11 rounded-full bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center hover:bg-sky-100 transition' aria-label='Close navigation menu'>
                <FaTimes />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto px-5 sm:px-7 py-6'>
              <Link
                to='/'
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5 border transition ${isHome ? 'bg-sky-50 border-sky-200 text-sky-600' : 'border-sky-100 text-sky-800 hover:bg-sky-50'}`}
              >
                <span className='flex items-center gap-3 font-semibold'><FaHome className='text-sky-400' />Home</span>
                <FaChevronRight className='text-sky-300' />
              </Link>

              <div className='mt-7'>
                <p className='text-xs font-bold uppercase tracking-[0.22em] text-sky-400'>Choose your world</p>
                <p className='text-sm text-sky-700/60 mt-2 leading-6'>Pick exactly what you came to RoomPlug for.</p>
              </div>

              <div className='grid gap-3 mt-5'>
                {CATEGORY_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  const active = category?.slug === item.slug;
                  return (
                    <button
                      key={item.slug}
                      type='button'
                      onClick={() => goToCategory(item.slug)}
                      className={`w-full text-left rounded-[24px] border p-4 transition ${active ? 'bg-sky-50 border-sky-200 shadow-sm' : 'bg-white border-sky-100 hover:bg-sky-50 hover:border-sky-200'}`}
                    >
                      <div className='flex items-center gap-3'>
                        <div className='h-11 w-11 shrink-0 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500'><Icon /></div>
                        <div className='min-w-0 flex-1'>
                          <p className='font-bold text-sky-950 truncate'>{item.name}</p>
                          <p className='text-xs text-sky-700/60 mt-1 leading-5'>{item.description}</p>
                        </div>
                        <FaChevronRight className='text-sky-300 shrink-0' />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className='mt-8 pt-6 border-t border-sky-100'>
                <p className='text-xs font-bold uppercase tracking-[0.22em] text-sky-400'>RoomPlug</p>
                <div className='grid gap-2 mt-4'>
                  <Link to='/about' onClick={() => setMenuOpen(false)} className='rounded-2xl px-4 py-3 text-sky-800 hover:bg-sky-50 transition'>How RoomPlug works</Link>
                  <Link to='/search' onClick={() => setMenuOpen(false)} className='rounded-2xl px-4 py-3 text-sky-800 hover:bg-sky-50 transition'>Explore listings</Link>
                  <Link to={currentUser ? '/profile' : '/sign-in'} onClick={() => setMenuOpen(false)} className='rounded-2xl px-4 py-3 text-sky-800 hover:bg-sky-50 transition'>{currentUser ? 'My profile' : 'Sign in'}</Link>
                  {currentUser?.isAdmin === true && (
                    <Link to='/admin' onClick={() => setMenuOpen(false)} className='rounded-2xl px-4 py-3 text-sky-800 hover:bg-sky-50 transition flex items-center gap-2'><FaTachometerAlt className='text-sky-400' />Admin dashboard</Link>
                  )}
                </div>
              </div>
            </div>

            <div className='border-t border-sky-100 px-5 sm:px-7 py-4 bg-sky-50/70'>
              <button type='button' onClick={() => { setMenuOpen(false); navigate('/'); }} className='w-full bg-sky-400 hover:bg-sky-500 text-white font-semibold rounded-2xl py-3.5 transition shadow-lg shadow-sky-100'>
                Start again from Home
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
