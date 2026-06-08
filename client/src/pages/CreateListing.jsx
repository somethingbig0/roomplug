import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const isAdmin = currentUser?.isAdmin === true;

  const [files, setFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);

  const [formData, setFormData] = useState({
    imageUrls: [],
    videoUrl: '',
    name: '',
    description: '',
    address: '',
    exactAddress: '',
    landlordName: '',
    landlordPhone: '',
    landlordEmail: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    roomAllocation: 1,
    genderAllowed: 'any',
    spaceLevel: '',
    regularPrice: 50,
    discountPrice: 0,
    nonRefundableDeposit: 0,
    offer: false,
    parking: false,
    furnished: false,
    distanceToCampus: '',
    timeToCampus: '',
    transportType: '',
    transportCost: 0,
    wifi: '',
    zesaBackup: '',
    waterSource: '',
    geyser: false,
    lounge: false,
    fittedKitchen: false,
    cleaningServices: false,
    refrigerator: false,
    microwave: false,
    wardrobes: false,
    studyDesk: false,
    swimmingPool: false,
    security: '',
    cookingType: '',
    curfew: 'no',
    curfewTime: '',
    visitorsAllowed: 'not specified',
    visitorsGender: '',
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const booleanFields = [
    'parking',
    'furnished',
    'offer',
    'geyser',
    'lounge',
    'fittedKitchen',
    'cleaningServices',
    'refrigerator',
    'microwave',
    'wardrobes',
    'studyDesk',
    'swimmingPool',
  ];

  if (!isAdmin) {
    return (
      <main className='min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 flex items-center justify-center px-4'>
        <div className='bg-white border border-sky-100 rounded-[32px] p-8 max-w-md w-full text-center shadow-sm'>
          <h1 className='text-2xl font-bold text-sky-950'>
            Admin access only
          </h1>

          <p className='text-sky-700/70 mt-3 leading-7'>
            This page is only for RoomPlug admins. Student accounts can browse
            rooms and update their profile details.
          </p>

          <Link
            to='/'
            className='inline-block mt-6 bg-sky-400 text-white px-6 py-3 rounded-full hover:bg-sky-500'
          >
            Go back home
          </Link>
        </div>
      </main>
    );
  }

  const uploadFile = async (file) => {
    const data = new FormData();
    data.append('file', file);

    const res = await fetch('/api/upload/single', {
      method: 'POST',
      body: data,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Upload failed');
    }

    return result.url;
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 5) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(uploadFile(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.concat(urls),
          }));
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError(err.message || 'Image upload failed');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 5 photos per room');
      setUploading(false);
    }
  };

  const handleVideoSubmit = async () => {
    try {
      if (!videoFile) {
        return setVideoUploadError('Please choose a short room video first');
      }

      setVideoUploading(true);
      setVideoUploadError(false);

      const videoUrl = await uploadFile(videoFile);

      setFormData((prev) => ({
        ...prev,
        videoUrl,
      }));

      setVideoUploading(false);
    } catch (error) {
      setVideoUploadError(error.message || 'Video upload failed');
      setVideoUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveVideo = () => {
    setFormData((prev) => ({
      ...prev,
      videoUrl: '',
    }));
    setVideoFile(null);
    setVideoUploadError(false);
  };

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;

    if (id === 'sale' || id === 'rent') {
      setFormData((prev) => ({
        ...prev,
        type: id,
      }));
      return;
    }

    if (booleanFields.includes(id)) {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
      }));
      return;
    }

    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [id]: Number(value),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isAdmin) {
        return setError('Only admins can create rooms');
      }

      if (formData.imageUrls.length < 1) {
        return setError('You must upload at least one image');
      }

      if (formData.imageUrls.length > 5) {
        return setError('You can only upload 5 photos per room');
      }

      if (!formData.videoUrl) {
        return setError('You must upload one short room tour video');
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        return setError('Discount price must be lower than regular price');
      }

      setLoading(true);
      setError(false);

      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      setLoading(false);

      if (!res.ok || data.success === false) {
        setError(data.message || 'Something went wrong');
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-[1400px] mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 text-sky-950'>
        Add Room
      </h1>

      <form onSubmit={handleSubmit} className='grid lg:grid-cols-2 gap-6'>
        <div className='flex flex-col gap-5'>
          <section className='bg-white border border-sky-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-4'>
            <h2 className='text-xl font-bold text-sky-950'>Basic room info</h2>

            <input
              type='text'
              placeholder='Room title, e.g. Room of 2 for girls only'
              className='border border-sky-100 p-3 rounded-lg'
              id='name'
              maxLength='80'
              minLength='5'
              required
              onChange={handleChange}
              value={formData.name}
            />

            <textarea
              placeholder='Room description'
              className='border border-sky-100 p-3 rounded-lg min-h-[120px]'
              id='description'
              required
              onChange={handleChange}
              value={formData.description}
            />

            <input
              type='text'
              placeholder='Public location only, e.g. Mount Pleasant'
              className='border border-sky-100 p-3 rounded-lg'
              id='address'
              required
              onChange={handleChange}
              value={formData.address}
            />

            <input
              type='text'
              placeholder='Exact address hidden until payment'
              className='border border-sky-100 p-3 rounded-lg'
              id='exactAddress'
              onChange={handleChange}
              value={formData.exactAddress}
            />
          </section>

          <section className='bg-white border border-sky-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-4'>
            <h2 className='text-xl font-bold text-sky-950'>Rent and deposit</h2>

            <div className='grid sm:grid-cols-3 gap-4'>
              <div>
                <label className='text-sm text-sky-700'>Monthly rent $</label>
                <input
                  type='number'
                  id='regularPrice'
                  min='1'
                  max='10000000'
                  required
                  className='p-3 border border-sky-100 rounded-lg w-full mt-1'
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
              </div>

              <div>
                <label className='text-sm text-sky-700'>
                  Discounted rent $
                </label>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  className='p-3 border border-sky-100 rounded-lg w-full mt-1'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
              </div>

              <div>
                <label className='text-sm text-sky-700'>
                  Nonrefundable deposit $
                </label>
                <input
                  type='number'
                  id='nonRefundableDeposit'
                  min='0'
                  max='10000000'
                  className='p-3 border border-sky-100 rounded-lg w-full mt-1'
                  onChange={handleChange}
                  value={formData.nonRefundableDeposit}
                />
              </div>
            </div>

            <div className='flex gap-6 flex-wrap'>
              <label className='flex gap-2 items-center'>
                <input
                  type='checkbox'
                  id='rent'
                  className='w-5 h-5'
                  onChange={handleChange}
                  checked={formData.type === 'rent'}
                />
                <span>Rent</span>
              </label>

              <label className='flex gap-2 items-center'>
                <input
                  type='checkbox'
                  id='sale'
                  className='w-5 h-5'
                  onChange={handleChange}
                  checked={formData.type === 'sale'}
                />
                <span>Other</span>
              </label>

              <label className='flex gap-2 items-center'>
                <input
                  type='checkbox'
                  id='offer'
                  className='w-5 h-5'
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Discount / Offer</span>
              </label>
            </div>
          </section>

          <section className='bg-white border border-sky-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-4'>
            <h2 className='text-xl font-bold text-sky-950'>Room setup</h2>

            <div className='grid sm:grid-cols-3 gap-4'>
              <div>
                <label className='text-sm text-sky-700'>Beds</label>
                <input
                  type='number'
                  id='bedrooms'
                  min='1'
                  max='10'
                  required
                  className='p-3 border border-sky-100 rounded-lg w-full mt-1'
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
              </div>

              <div>
                <label className='text-sm text-sky-700'>Baths</label>
                <input
                  type='number'
                  id='bathrooms'
                  min='1'
                  max='10'
                  required
                  className='p-3 border border-sky-100 rounded-lg w-full mt-1'
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
              </div>

              <div>
                <label className='text-sm text-sky-700'>Room of</label>
                <input
                  type='number'
                  id='roomAllocation'
                  min='1'
                  max='10'
                  required
                  className='p-3 border border-sky-100 rounded-lg w-full mt-1'
                  onChange={handleChange}
                  value={formData.roomAllocation}
                />
              </div>
            </div>

            <select
              id='genderAllowed'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.genderAllowed}
            >
              <option value='any'>Any gender</option>
              <option value='girls only'>Girls only</option>
              <option value='boys only'>Boys only</option>
              <option value='couples'>Couples</option>
            </select>

            <select
              id='spaceLevel'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.spaceLevel}
            >
              <option value=''>How free is the room space?</option>
              <option value='very spacious'>Very spacious</option>
              <option value='moderate'>Moderate</option>
              <option value='tight'>Tight</option>
            </select>
          </section>

          <section className='bg-white border border-sky-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-4'>
            <h2 className='text-xl font-bold text-sky-950'>
              Campus distance and transport
            </h2>

            <input
              type='text'
              placeholder='Distance to campus, e.g. 1.2km from UZ'
              id='distanceToCampus'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.distanceToCampus}
            />

            <input
              type='text'
              placeholder='Time to campus, e.g. 10 min walk / 7 min drive'
              id='timeToCampus'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.timeToCampus}
            />

            <select
              id='transportType'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.transportType}
            >
              <option value=''>Transport type</option>
              <option value='walkable'>Walkable</option>
              <option value='kombi'>Kombi</option>
              <option value='indrive'>inDrive</option>
              <option value='bus'>Bus</option>
            </select>

            <input
              type='number'
              placeholder='Transport cost to campus $'
              id='transportCost'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.transportCost}
            />
          </section>
        </div>

        <div className='flex flex-col gap-5'>
          <section className='bg-white border border-sky-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-4'>
            <h2 className='text-xl font-bold text-sky-950'>
              Utilities and amenities
            </h2>

            <input
              type='text'
              placeholder='WiFi, e.g. ZOL / TelOne / Starlink / None'
              id='wifi'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.wifi}
            />

            <input
              type='text'
              placeholder='ZESA backup, e.g. Solar / Generator / None'
              id='zesaBackup'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.zesaBackup}
            />

            <input
              type='text'
              placeholder='Water source, e.g. Council / Borehole'
              id='waterSource'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.waterSource}
            />

            <input
              type='text'
              placeholder='Security, e.g. Durawall / Fence / Security company'
              id='security'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.security}
            />

            <input
              type='text'
              placeholder='Cooking, e.g. Electric stove / Gas stove'
              id='cookingType'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.cookingType}
            />

            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
              {[
                ['parking', 'Parking'],
                ['furnished', 'Furnished'],
                ['geyser', 'Geyser'],
                ['lounge', 'Lounge'],
                ['fittedKitchen', 'Fitted kitchen'],
                ['cleaningServices', 'Cleaning services'],
                ['refrigerator', 'Refrigerator'],
                ['microwave', 'Microwave'],
                ['wardrobes', 'Wardrobes'],
                ['studyDesk', 'Study desk'],
                ['swimmingPool', 'Swimming pool'],
              ].map(([id, label]) => (
                <label
                  key={id}
                  className='flex gap-2 items-center bg-sky-50 border border-sky-100 rounded-2xl px-3 py-2'
                >
                  <input
                    type='checkbox'
                    id={id}
                    checked={formData[id]}
                    onChange={handleChange}
                  />
                  <span className='text-sm'>{label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className='bg-white border border-sky-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-4'>
            <h2 className='text-xl font-bold text-sky-950'>House rules</h2>

            <select
              id='curfew'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.curfew}
            >
              <option value='no'>No curfew</option>
              <option value='yes'>Curfew applies</option>
            </select>

            {formData.curfew === 'yes' && (
              <input
                type='text'
                placeholder='Curfew time, e.g. 9PM'
                id='curfewTime'
                className='border border-sky-100 p-3 rounded-lg'
                onChange={handleChange}
                value={formData.curfewTime}
              />
            )}

            <select
              id='visitorsAllowed'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.visitorsAllowed}
            >
              <option value='not specified'>Visitors not specified</option>
              <option value='allowed'>Visitors allowed</option>
              <option value='not allowed'>Visitors not allowed</option>
            </select>

            <input
              type='text'
              placeholder='Visitor gender rules, e.g. same gender only'
              id='visitorsGender'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.visitorsGender}
            />
          </section>

          <section className='bg-white border border-sky-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-4'>
            <h2 className='text-xl font-bold text-sky-950'>
              Hidden landlord details
            </h2>

            <input
              type='text'
              placeholder='Landlord name'
              id='landlordName'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.landlordName}
            />

            <input
              type='text'
              placeholder='Landlord phone number'
              id='landlordPhone'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.landlordPhone}
            />

            <input
              type='email'
              placeholder='Landlord email'
              id='landlordEmail'
              className='border border-sky-100 p-3 rounded-lg'
              onChange={handleChange}
              value={formData.landlordEmail}
            />

            <p className='text-xs text-sky-700/60'>
              These details must stay hidden until the student has paid the
              RoomPlug connection/access fee.
            </p>
          </section>

          <section className='bg-white border border-sky-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-4'>
            <h2 className='text-xl font-bold text-sky-950'>Photos and video</h2>

            <p className='font-semibold text-sky-950'>
              Room photos
              <span className='font-normal text-sky-700/60 ml-2'>
                Upload exactly up to 5 photos
              </span>
            </p>

            <div className='flex gap-3'>
              <input
                onChange={(e) => setFiles(e.target.files)}
                className='p-3 border border-sky-100 rounded w-full'
                type='file'
                id='images'
                accept='image/*'
                multiple
              />

              <button
                type='button'
                disabled={uploading}
                onClick={handleImageSubmit}
                className='px-5 text-sky-500 border border-sky-200 rounded-full uppercase hover:shadow-lg disabled:opacity-80'
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>

            <p className='text-red-700 text-sm'>
              {imageUploadError && imageUploadError}
            </p>

            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className='flex justify-between p-3 border border-sky-100 rounded-2xl items-center'
                >
                  <img
                    src={url}
                    alt='listing image'
                    className='w-20 h-20 object-cover rounded-2xl'
                  />

                  <button
                    type='button'
                    onClick={() => handleRemoveImage(index)}
                    className='p-3 text-red-600 rounded-lg uppercase hover:opacity-75'
                  >
                    Delete
                  </button>
                </div>
              ))}

            <p className='font-semibold text-sky-950 mt-4'>
              Short room video tour
              <span className='font-normal text-sky-700/60 ml-2'>
                20–30 sec preview
              </span>
            </p>

            <div className='flex gap-3'>
              <input
                onChange={(e) => setVideoFile(e.target.files[0])}
                className='p-3 border border-sky-100 rounded w-full'
                type='file'
                id='video'
                accept='video/*'
              />

              <button
                type='button'
                disabled={videoUploading}
                onClick={handleVideoSubmit}
                className='px-5 text-sky-500 border border-sky-200 rounded-full uppercase hover:shadow-lg disabled:opacity-80'
              >
                {videoUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>

            <p className='text-red-700 text-sm'>
              {videoUploadError && videoUploadError}
            </p>

            {formData.videoUrl && (
              <div className='border border-sky-100 rounded-3xl p-3'>
                <video
                  src={formData.videoUrl}
                  controls
                  className='w-full max-h-[260px] rounded-2xl bg-sky-50'
                />

                <button
                  type='button'
                  onClick={handleRemoveVideo}
                  className='mt-3 text-red-600 uppercase hover:opacity-75'
                >
                  Delete video
                </button>
              </div>
            )}
          </section>

          <button
            disabled={loading || uploading || videoUploading}
            className='p-4 bg-sky-400 text-white rounded-full uppercase hover:bg-sky-500 disabled:opacity-80 shadow-lg shadow-sky-100'
          >
            {loading ? 'Creating...' : 'Create room'}
          </button>

          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}