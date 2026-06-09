import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInFailure, signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(signInFailure(data.message || 'Google sign in failed'));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('Could not sign in with Google', error);
      dispatch(signInFailure('Google sign in failed. Please try again.'));
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='w-full border border-sky-100 bg-white text-slate-700 p-4 rounded-2xl font-semibold hover:bg-sky-50 transition flex items-center justify-center gap-3'
    >
      <span className='w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-red-500'>
        G
      </span>
      Continue with Google
    </button>
  );
}