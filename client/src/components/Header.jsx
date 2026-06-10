import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import logoLight from '../assets/roomplug-logo.png';
import logoDark from '../assets/roomplug-logo-dark.png';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-white/95 backdrop-blur-xl sticky top-0 z-50 border-b border-sky-100'>
      <div className='flex justify-between items-center w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 py-2 gap-3 sm:gap-6'>
        <Link to='/' className='flex items-center min-w-fit'>
          <img
            src={logoLight}
            alt='RoomPlug'
            className='h-11 sm:h-14 w-auto object-contain roomplug-logo-light'
          />

          <img
            src={logoDark}
            alt='RoomPlug'
            className='h-11 sm:h-14 w-auto object-contain roomplug-logo-dark hidden'
          />
        </Link>

        <form
          onSubmit={handleSubmit}
          className='bg-sky-50 border border-sky-100 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full flex items-center flex-1 max-w-2xl shadow-sm'
        >
          <input
            type='text'
            placeholder='Search rooms, areas, or campuses...'
            className='bg-transparent focus:outline-none w-full text-xs sm:text-sm text-sky-900 placeholder:text-sky-400'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button type='submit' className='ml-2'>
            <FaSearch className='text-sky-500' />
          </button>
        </form>

        <ul className='flex items-center gap-3 sm:gap-5 text-sm font-medium'>
          <Link to='/'>
            <li className='hidden sm:inline text-sky-800 hover:text-sky-500 transition'>
              Home
            </li>
          </Link>

          <Link to='/about'>
            <li className='hidden sm:inline text-sky-800 hover:text-sky-500 transition'>
              How it works
            </li>
          </Link>

          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-10 w-10 object-cover border-2 border-sky-100 shadow-sm hover:scale-105'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className='text-white bg-sky-400 hover:bg-sky-500 transition px-4 sm:px-5 py-2.5 rounded-full shadow-sm shadow-sky-100'>
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}