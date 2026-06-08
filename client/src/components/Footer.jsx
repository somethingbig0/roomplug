import {
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className='bg-white border-t border-sky-100 mt-16'>
      <div className='w-full max-w-[1500px] mx-auto px-6 lg:px-12 py-12'>
        <div className='grid md:grid-cols-3 gap-10'>
          <div>
            <h2 className='text-3xl font-bold text-sky-500'>RoomPlug</h2>
            <p className='text-sky-700/60 mt-1 text-sm'>
              Your accommodation plug
            </p>

            <p className='text-sky-800/70 mt-5 leading-7'>
              RoomPlug helps students and young renters find verified rooms
              through photos, short video tours and a safer connection process.
            </p>
          </div>

          <div>
            <h3 className='text-xl font-bold text-sky-950'>Contact us</h3>

            <div className='flex flex-col gap-4 mt-5 text-sky-700/80'>
              <a
                href='tel:+263774662843'
                className='flex items-center gap-3 hover:text-sky-500'
              >
                <FaPhoneAlt className='text-sky-400' />
                +263 77 466 2843
              </a>

              <a
                href='https://wa.me/263774662843'
                target='_blank'
                rel='noreferrer'
                className='flex items-center gap-3 hover:text-sky-500'
              >
                <FaWhatsapp className='text-sky-400' />
                WhatsApp us
              </a>

              <a
                href='mailto:roomplug@gmail.com'
                className='flex items-center gap-3 hover:text-sky-500'
              >
                <FaEnvelope className='text-sky-400' />
                roomplug@gmail.com
              </a>

              <p className='flex items-center gap-3'>
                <FaMapMarkerAlt className='text-sky-400' />
                Harare, Zimbabwe
              </p>
            </div>
          </div>

          <div>
            <h3 className='text-xl font-bold text-sky-950'>Follow us</h3>

            <div className='flex gap-3 mt-5'>
              <a
                href='https://instagram.com/roomplug'
                target='_blank'
                rel='noreferrer'
                className='h-11 w-11 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 hover:bg-sky-400 hover:text-white'
              >
                <FaInstagram />
              </a>

              <a
                href='https://facebook.com/roomplug'
                target='_blank'
                rel='noreferrer'
                className='h-11 w-11 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 hover:bg-sky-400 hover:text-white'
              >
                <FaFacebookF />
              </a>

              <a
                href='https://tiktok.com/@roomplug'
                target='_blank'
                rel='noreferrer'
                className='h-11 w-11 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 hover:bg-sky-400 hover:text-white'
              >
                <FaTiktok />
              </a>
            </div>

            <div className='mt-7 flex flex-col gap-2 text-sky-700/70'>
              <Link to='/' className='hover:text-sky-500'>
                Home
              </Link>
              <Link to='/search?type=rent' className='hover:text-sky-500'>
                Browse rooms
              </Link>
              <Link to='/about' className='hover:text-sky-500'>
                How it works
              </Link>
            </div>
          </div>
        </div>

        <div className='border-t border-sky-100 mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-sm text-sky-700/50'>
          <p>© {new Date().getFullYear()} RoomPlug. All rights reserved.</p>
          <p>Built for student accommodation in Zimbabwe.</p>
        </div>
      </div>
    </footer>
  );
}