import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 px-4 py-10'>
      <div className='max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center'>
        {/* Left hero section */}
        <div className='hidden lg:block'>
          <div className='bg-white/80 backdrop-blur-xl border border-sky-100 rounded-[2rem] p-10 shadow-xl shadow-sky-100/50'>
            <p className='text-sm font-semibold text-sky-500 uppercase tracking-[0.25em]'>
              Join RoomPlug
            </p>

            <h1 className='text-5xl font-bold text-slate-800 mt-4 leading-tight'>
              Find student accommodation with less stress.
            </h1>

            <p className='text-slate-500 mt-5 text-lg leading-8'>
              Create your account to browse verified rooms, update your profile,
              and prepare to connect safely with available accommodation.
            </p>

            <div className='mt-10 space-y-4'>
              <div className='flex gap-4 bg-sky-50 border border-sky-100 rounded-3xl p-5'>
                <div className='w-10 h-10 rounded-full bg-sky-400 text-white flex items-center justify-center font-bold'>
                  1
                </div>
                <div>
                  <h3 className='font-bold text-slate-800'>Browse for free</h3>
                  <p className='text-sm text-slate-500 mt-1'>
                    See verified listings before making a decision.
                  </p>
                </div>
              </div>

              <div className='flex gap-4 bg-sky-50 border border-sky-100 rounded-3xl p-5'>
                <div className='w-10 h-10 rounded-full bg-sky-400 text-white flex items-center justify-center font-bold'>
                  2
                </div>
                <div>
                  <h3 className='font-bold text-slate-800'>
                    View photos and videos
                  </h3>
                  <p className='text-sm text-slate-500 mt-1'>
                    Understand the room before wasting transport money.
                  </p>
                </div>
              </div>

              <div className='flex gap-4 bg-sky-50 border border-sky-100 rounded-3xl p-5'>
                <div className='w-10 h-10 rounded-full bg-sky-400 text-white flex items-center justify-center font-bold'>
                  3
                </div>
                <div>
                  <h3 className='font-bold text-slate-800'>
                    Connect when ready
                  </h3>
                  <p className='text-sm text-slate-500 mt-1'>
                    Pay only when you want landlord contact access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form section */}
        <div className='w-full max-w-xl mx-auto'>
          <div className='bg-white/90 backdrop-blur-xl border border-sky-100 rounded-[2rem] p-6 sm:p-10 shadow-xl shadow-sky-100/60'>
            <div className='text-center mb-8'>
              <p className='text-sm font-semibold text-sky-500 uppercase tracking-[0.25em]'>
                RoomPlug
              </p>

              <h1 className='text-3xl sm:text-4xl font-bold text-slate-800 mt-3'>
                Create account
              </h1>

              <p className='text-slate-500 mt-3'>
                Join RoomPlug and start browsing verified student rooms.
              </p>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div>
                <label className='text-sm font-semibold text-slate-700'>
                  Username
                </label>
                <input
                  type='text'
                  placeholder='Choose a username'
                  className='mt-2 border border-sky-100 bg-sky-50/60 p-4 rounded-2xl w-full outline-none focus:border-sky-400 focus:bg-white transition'
                  id='username'
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className='text-sm font-semibold text-slate-700'>
                  Email address
                </label>
                <input
                  type='email'
                  placeholder='you@example.com'
                  className='mt-2 border border-sky-100 bg-sky-50/60 p-4 rounded-2xl w-full outline-none focus:border-sky-400 focus:bg-white transition'
                  id='email'
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className='text-sm font-semibold text-slate-700'>
                  Password
                </label>
                <input
                  type='password'
                  placeholder='Create a password'
                  className='mt-2 border border-sky-100 bg-sky-50/60 p-4 rounded-2xl w-full outline-none focus:border-sky-400 focus:bg-white transition'
                  id='password'
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                disabled={loading}
                className='mt-2 bg-sky-400 text-white p-4 rounded-2xl uppercase font-semibold hover:bg-sky-500 transition shadow-lg shadow-sky-100 disabled:opacity-70'
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <div className='flex items-center gap-3 my-2'>
                <div className='h-px bg-sky-100 flex-1'></div>
                <span className='text-xs text-slate-400 uppercase tracking-widest'>
                  or
                </span>
                <div className='h-px bg-sky-100 flex-1'></div>
              </div>

              <OAuth />
            </form>

            <div className='flex justify-center gap-2 mt-6 text-sm sm:text-base'>
              <p className='text-slate-500'>Already have an account?</p>
              <Link to='/sign-in'>
                <span className='text-sky-500 font-semibold hover:text-sky-600'>
                  Sign in
                </span>
              </Link>
            </div>

            {error && (
              <div className='mt-6 bg-red-50 border border-red-100 text-red-500 p-4 rounded-2xl text-sm'>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}