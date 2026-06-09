import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(signInFailure(data.message || 'Sign in failed'));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 px-4 py-10'>
      <div className='max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center'>
        {/* Left hero section */}
        <div className='hidden lg:block'>
          <div className='bg-white/80 backdrop-blur-xl border border-sky-100 rounded-[2rem] p-10 shadow-xl shadow-sky-100/50'>
            <p className='text-sm font-semibold text-sky-500 uppercase tracking-[0.25em]'>
              Welcome back
            </p>

            <h1 className='text-5xl font-bold text-slate-800 mt-4 leading-tight'>
              Continue your RoomPlug journey.
            </h1>

            <p className='text-slate-500 mt-5 text-lg leading-8'>
              Sign in to manage your profile, browse verified student rooms,
              and connect with accommodation faster and safer.
            </p>

            <div className='grid grid-cols-2 gap-4 mt-10'>
              <div className='bg-sky-50 border border-sky-100 rounded-3xl p-5'>
                <h3 className='font-bold text-slate-800'>Verified rooms</h3>
                <p className='text-sm text-slate-500 mt-2'>
                  Listings uploaded by the RoomPlug team.
                </p>
              </div>

              <div className='bg-sky-50 border border-sky-100 rounded-3xl p-5'>
                <h3 className='font-bold text-slate-800'>Safer access</h3>
                <p className='text-sm text-slate-500 mt-2'>
                  View rooms before connecting with landlords.
                </p>
              </div>

              <div className='bg-sky-50 border border-sky-100 rounded-3xl p-5'>
                <h3 className='font-bold text-slate-800'>Student-first</h3>
                <p className='text-sm text-slate-500 mt-2'>
                  Built for campus accommodation needs.
                </p>
              </div>

              <div className='bg-sky-50 border border-sky-100 rounded-3xl p-5'>
                <h3 className='font-bold text-slate-800'>Fast search</h3>
                <p className='text-sm text-slate-500 mt-2'>
                  Find rooms by area, campus, or preference.
                </p>
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
                Sign in
              </h1>

              <p className='text-slate-500 mt-3'>
                Access your account and continue finding verified rooms.
              </p>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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
                  placeholder='Enter your password'
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
                {loading ? 'Signing in...' : 'Sign in'}
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
              <p className='text-slate-500'>Don&apos;t have an account?</p>
              <Link to='/sign-up'>
                <span className='text-sky-500 font-semibold hover:text-sky-600'>
                  Create one
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