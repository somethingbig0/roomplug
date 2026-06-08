import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const dispatch = useDispatch();
  const isAdmin = currentUser?.isAdmin === true;

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    try {
      setFileUploadError(false);
      setFilePerc(0);

      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload/single', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Image upload failed');
      }

      setFormData((prev) => ({
        ...prev,
        avatar: result.url,
      }));

      setFilePerc(100);
    } catch (error) {
      console.log(error.message);
      setFileUploadError(true);
      setFilePerc(0);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(updateUserFailure(data.message || 'Update failed'));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setFilePerc(0);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(deleteUserFailure(data.message || 'Delete failed'));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch('/api/auth/signout', {
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(deleteUserFailure(data.message || 'Sign out failed'));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    if (!isAdmin) return;

    try {
      setShowListingsError(false);

      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    if (!isAdmin) return;

    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        console.log(data.message || 'Delete listing failed');
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 text-sky-950'>
        Profile
      </h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-2 border-sky-100'
        />

        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>Image upload failed</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-sky-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>
              Image uploaded. Click Update to save.
            </span>
          ) : (
            ''
          )}
        </p>

        <input
          type='text'
          placeholder='username'
          defaultValue={currentUser.username}
          id='username'
          className='border border-sky-100 p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type='email'
          placeholder='email'
          id='email'
          defaultValue={currentUser.email}
          className='border border-sky-100 p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type='text'
          placeholder='phone number'
          id='phoneNumber'
          defaultValue={currentUser.phoneNumber || ''}
          className='border border-sky-100 p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type='text'
          placeholder='school ID number'
          id='schoolIdNumber'
          defaultValue={currentUser.schoolIdNumber || ''}
          className='border border-sky-100 p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type='password'
          placeholder='password'
          onChange={handleChange}
          id='password'
          className='border border-sky-100 p-3 rounded-lg'
        />

        <button
          disabled={loading}
          className='bg-sky-400 text-white rounded-full p-3 uppercase hover:bg-sky-500 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update profile'}
        </button>

        {isAdmin && (
          <Link
            className='bg-green-600 text-white p-3 rounded-full uppercase text-center hover:opacity-95'
            to='/create-listing'
          >
            Add Room
          </Link>
        )}
      </form>

      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>

        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>

      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'Profile updated successfully!' : ''}
      </p>

      {isAdmin && (
        <>
          <button
            onClick={handleShowListings}
            className='text-green-700 w-full mt-5'
          >
            Show Admin Listings
          </button>

          <p className='text-red-700 mt-5'>
            {showListingsError ? 'Error showing listings' : ''}
          </p>

          {userListings && userListings.length > 0 && (
            <div className='flex flex-col gap-4'>
              <h1 className='text-center mt-7 text-2xl font-semibold text-sky-950'>
                Admin Listings
              </h1>

              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className='border border-sky-100 rounded-2xl p-3 flex justify-between items-center gap-4'
                >
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      src={listing.imageUrls[0]}
                      alt='listing cover'
                      className='h-16 w-16 object-cover rounded-xl'
                    />
                  </Link>

                  <Link
                    className='text-sky-900 font-semibold hover:underline truncate flex-1'
                    to={`/listing/${listing._id}`}
                  >
                    <p>{listing.name}</p>
                  </Link>

                  <div className='flex flex-col item-center'>
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className='text-red-700 uppercase'
                    >
                      Delete
                    </button>

                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-green-700 uppercase'>Edit</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!isAdmin && (
        <p className='text-center text-sky-700/70 mt-7 text-sm'>
          You are signed in as a student account. You can browse rooms and
          update your profile details.
        </p>
      )}
    </div>
  );
}