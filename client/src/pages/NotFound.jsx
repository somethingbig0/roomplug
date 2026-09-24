import { Link } from 'react-router-dom';
import { usePageSEO, absoluteUrl } from '../components/SEO';

export default function NotFound() {
  usePageSEO({
    title: 'Page Not Found | RoomPlug',
    description: 'The RoomPlug page you requested could not be found.',
    canonicalPath: '/',
    robots: 'noindex,nofollow',
  });

  return (
    <main className='min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 flex items-center justify-center px-4'>
      <div className='bg-white border border-sky-100 rounded-[32px] p-8 max-w-lg w-full text-center shadow-sm'>
        <p className='text-sm font-semibold uppercase tracking-[0.25em] text-sky-400'>
          RoomPlug
        </p>
        <h1 className='text-4xl font-bold text-sky-950 mt-3'>Page not found</h1>
        <p className='text-sky-700/70 mt-3 leading-7'>
          The accommodation page you are looking for does not exist or is no longer available.
        </p>
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
