import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaExternalLinkAlt, FaPlus, FaSave, FaTrash, FaToggleOff, FaToggleOn } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const EMPTY_FORM = {
  name: '',
  description: '',
  bookingFee: 0,
  displayOrder: 10,
  active: true,
};

export default function AdminDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [sections, setSections] = useState([]);
  const [listings, setListings] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [sectionEdits, setSectionEdits] = useState({});
  const [listingSections, setListingSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const totalListings = listings.length;
  const activeSections = sections.filter((section) => section.active).length;

  const sectionsBySlug = useMemo(
    () => Object.fromEntries(sections.map((section) => [section.slug, section])),
    [sections]
  );

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const [sectionRes, listingRes] = await Promise.all([
        fetch('/api/section/get/admin', { credentials: 'include' }),
        fetch('/api/listing/get?limit=1000', { credentials: 'include' }),
      ]);

      const sectionData = await sectionRes.json();
      const listingData = await listingRes.json();

      if (!sectionRes.ok || sectionData.success === false) {
        throw new Error(sectionData.message || 'Failed to load sections');
      }

      if (!listingRes.ok || listingData.success === false) {
        throw new Error(listingData.message || 'Failed to load listings');
      }

      setSections(sectionData);
      setListings(listingData);
      setSectionEdits(
        Object.fromEntries(
          sectionData.map((section) => [
            section.slug,
            {
              name: section.name,
              description: section.description || '',
              bookingFee: section.bookingFee,
              displayOrder: section.displayOrder,
              active: section.active,
            },
          ])
        )
      );
      setListingSections(
        Object.fromEntries(
          listingData.map((listing) => [listing._id, listing.section || 'general-accommodation'])
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to load the admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleCreateSection = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage('');
      setError('');

      const res = await fetch('/api/section/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to create section');
      }

      setMessage(`${data.name} was created.`);
      setFormData(EMPTY_FORM);
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Failed to create section');
    } finally {
      setSaving(false);
    }
  };

  const saveSection = async (slug, overrideValues = null) => {
    const values = overrideValues || sectionEdits[slug];

    try {
      setSaving(true);
      setMessage('');
      setError('');

      const res = await fetch(`/api/section/update/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to update section');
      }

      setMessage(`${data.name} has been updated.`);
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = async (slug, active) => {
    const values = sectionEdits[slug];
    await saveSection(slug, { ...values, active });
  };

  const reassignListing = async (listingId) => {
    const section = listingSections[listingId];

    try {
      setSaving(true);
      setMessage('');
      setError('');

      const res = await fetch(`/api/listing/update/${listingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ section }),
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to reassign listing');
      }

      setMessage('Listing section updated.');
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Failed to reassign listing');
    } finally {
      setSaving(false);
    }
  };

  const deleteListing = async (listingId) => {
    const confirmed = window.confirm('Delete this listing permanently?');
    if (!confirmed) return;

    try {
      setSaving(true);
      setMessage('');
      setError('');

      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to delete listing');
      }

      setMessage('Listing deleted.');
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Failed to delete listing');
    } finally {
      setSaving(false);
    }
  };

  if (currentUser?.isAdmin !== true) {
    return null;
  }

  return (
    <main className='min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50'>
      <div className='max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12'>
        <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.25em] text-sky-400'>
              RoomPlug admin
            </p>
            <h1 className='text-3xl sm:text-5xl font-bold text-sky-950 mt-2'>
              Admin dashboard
            </h1>
            <p className='text-sky-700/70 mt-3 max-w-3xl leading-7'>
              Manage accommodation sections, booking fees and listing categories from one place.
            </p>
          </div>

          <div className='flex flex-wrap gap-3'>
            <Link
              to='/create-listing'
              className='inline-flex items-center gap-2 bg-sky-400 text-white px-5 py-3 rounded-full font-semibold hover:bg-sky-500'
            >
              <FaPlus /> Add listing
            </Link>
            <Link
              to='/'
              className='inline-flex items-center gap-2 border border-sky-200 text-sky-500 px-5 py-3 rounded-full font-semibold hover:bg-sky-50'
            >
              View site <FaExternalLinkAlt className='text-xs' />
            </Link>
          </div>
        </div>

        {message && (
          <div className='mb-5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl p-4'>
            {message}
          </div>
        )}
        {error && (
          <div className='mb-5 bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4'>
            {error}
          </div>
        )}

        <div className='grid sm:grid-cols-3 gap-4 mb-8'>
          <StatCard label='Total listings' value={totalListings} />
          <StatCard label='Active sections' value={activeSections} />
          <StatCard label='Sections created' value={sections.length} />
        </div>

        <section className='bg-white border border-sky-100 rounded-[32px] p-5 sm:p-7 shadow-sm mb-8'>
          <div className='flex items-start justify-between gap-4 mb-6'>
            <div>
              <h2 className='text-2xl font-bold text-sky-950'>Create a new section</h2>
              <p className='text-sky-700/60 text-sm mt-1'>
                Add another accommodation category later without changing the listing system.
              </p>
            </div>
            <FaPlus className='text-sky-300 text-2xl' />
          </div>

          <form onSubmit={handleCreateSection} className='grid lg:grid-cols-4 gap-4'>
            <input
              type='text'
              placeholder='Section name'
              className='border border-sky-100 rounded-2xl p-4'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type='number'
              min='0'
              placeholder='Booking fee'
              className='border border-sky-100 rounded-2xl p-4'
              value={formData.bookingFee}
              onChange={(e) => setFormData({ ...formData, bookingFee: Number(e.target.value) })}
            />
            <input
              type='number'
              min='0'
              placeholder='Display order'
              className='border border-sky-100 rounded-2xl p-4'
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
            />
            <label className='flex items-center gap-3 border border-sky-100 rounded-2xl p-4'>
              <input
                type='checkbox'
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              <span>Visible on the site</span>
            </label>
            <textarea
              placeholder='Short section description'
              className='border border-sky-100 rounded-2xl p-4 lg:col-span-3 min-h-[110px]'
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <button
              disabled={saving}
              className='bg-sky-400 text-white rounded-2xl font-semibold p-4 hover:bg-sky-500 disabled:opacity-60'
            >
              {saving ? 'Saving...' : 'Create section'}
            </button>
          </form>
        </section>

        {loading ? (
          <div className='bg-white border border-sky-100 rounded-[32px] p-10 text-center'>
            Loading dashboard...
          </div>
        ) : (
          <>
            <section className='bg-white border border-sky-100 rounded-[32px] p-5 sm:p-7 shadow-sm mb-8'>
              <div className='mb-6'>
                <h2 className='text-2xl font-bold text-sky-950'>Accommodation sections</h2>
                <p className='text-sky-700/60 text-sm mt-1'>
                  Set the booking/connection fee for each section and control whether it is visible.
                </p>
              </div>

              <div className='grid lg:grid-cols-2 gap-5'>
                {sections.map((section) => {
                  const edit = sectionEdits[section.slug] || {};

                  return (
                    <div key={section.slug} className='border border-sky-100 rounded-[28px] p-5 bg-sky-50/40'>
                      <div className='flex items-start justify-between gap-4'>
                        <div>
                          <h3 className='text-lg font-bold text-sky-950'>{section.name}</h3>
                          <p className='text-xs text-sky-700/50 mt-1'>{section.slug}</p>
                        </div>
                        <span className='bg-white border border-sky-100 rounded-full px-3 py-1 text-xs font-semibold text-sky-500'>
                          {section.listingCount} listings
                        </span>
                      </div>

                      <div className='grid sm:grid-cols-2 gap-3 mt-5'>
                        <input
                          type='text'
                          value={edit.name || ''}
                          onChange={(e) =>
                            setSectionEdits({
                              ...sectionEdits,
                              [section.slug]: { ...edit, name: e.target.value },
                            })
                          }
                          className='border border-sky-100 rounded-2xl p-3 bg-white'
                        />
                        <input
                          type='number'
                          min='0'
                          value={edit.bookingFee ?? 0}
                          onChange={(e) =>
                            setSectionEdits({
                              ...sectionEdits,
                              [section.slug]: { ...edit, bookingFee: Number(e.target.value) },
                            })
                          }
                          className='border border-sky-100 rounded-2xl p-3 bg-white'
                          placeholder='Booking fee'
                        />
                        <input
                          type='number'
                          min='0'
                          value={edit.displayOrder ?? 0}
                          onChange={(e) =>
                            setSectionEdits({
                              ...sectionEdits,
                              [section.slug]: { ...edit, displayOrder: Number(e.target.value) },
                            })
                          }
                          className='border border-sky-100 rounded-2xl p-3 bg-white'
                          placeholder='Display order'
                        />
                        <button
                          type='button'
                          onClick={() => toggleSection(section.slug, !edit.active)}
                          className='border border-sky-100 bg-white rounded-2xl p-3 flex items-center justify-center gap-2 text-sky-600 font-semibold'
                        >
                          {edit.active ? <FaToggleOn className='text-xl' /> : <FaToggleOff className='text-xl' />}
                          {edit.active ? 'Visible' : 'Hidden'}
                        </button>
                      </div>

                      <textarea
                        value={edit.description || ''}
                        onChange={(e) =>
                          setSectionEdits({
                            ...sectionEdits,
                            [section.slug]: { ...edit, description: e.target.value },
                          })
                        }
                        className='border border-sky-100 rounded-2xl p-3 bg-white w-full min-h-[90px] mt-3'
                      />

                      <div className='flex items-center justify-between gap-3 mt-4'>
                        <Link
                          to={`/section/${section.slug}`}
                          className='text-sm text-sky-500 hover:text-sky-600 font-semibold inline-flex items-center gap-2'
                        >
                          Open section <FaExternalLinkAlt className='text-xs' />
                        </Link>
                        <button
                          type='button'
                          disabled={saving}
                          onClick={() => saveSection(section.slug)}
                          className='bg-sky-400 text-white px-4 py-2.5 rounded-full font-semibold hover:bg-sky-500 disabled:opacity-60 inline-flex items-center gap-2'
                        >
                          <FaSave /> Save
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className='bg-white border border-sky-100 rounded-[32px] p-5 sm:p-7 shadow-sm'>
              <div className='mb-6'>
                <h2 className='text-2xl font-bold text-sky-950'>Listing management</h2>
                <p className='text-sky-700/60 text-sm mt-1'>
                  Reassign existing rooms to sections, edit them or remove them.
                </p>
              </div>

              {listings.length === 0 ? (
                <div className='p-8 text-center rounded-3xl bg-sky-50'>No listings yet.</div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full min-w-[900px] text-left'>
                    <thead>
                      <tr className='border-b border-sky-100 text-xs uppercase tracking-wider text-sky-700/50'>
                        <th className='py-3 pr-4'>Listing</th>
                        <th className='py-3 pr-4'>Section</th>
                        <th className='py-3 pr-4'>Rent</th>
                        <th className='py-3 pr-4'>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map((listing) => (
                        <tr key={listing._id} className='border-b border-sky-50'>
                          <td className='py-4 pr-4'>
                            <div className='flex items-center gap-3'>
                              <img
                                src={listing.imageUrls?.[0]}
                                alt={listing.name}
                                className='w-16 h-16 object-cover rounded-2xl bg-sky-50'
                              />
                              <div>
                                <p className='font-semibold text-sky-950'>{listing.name}</p>
                                <p className='text-sm text-sky-700/60'>{listing.address}</p>
                              </div>
                            </div>
                          </td>
                          <td className='py-4 pr-4'>
                            <div className='flex gap-2 items-center'>
                              <select
                                value={listingSections[listing._id] || 'general-accommodation'}
                                onChange={(e) =>
                                  setListingSections({ ...listingSections, [listing._id]: e.target.value })
                                }
                                className='border border-sky-100 rounded-xl p-2 bg-white'
                              >
                                {sections.map((section) => (
                                  <option key={section.slug} value={section.slug}>
                                    {section.name}
                                  </option>
                                ))}
                              </select>
                              <button
                                type='button'
                                onClick={() => reassignListing(listing._id)}
                                disabled={saving}
                                className='text-sky-500 hover:text-sky-700 p-2'
                                title='Save section'
                              >
                                <FaSave />
                              </button>
                            </div>
                          </td>
                          <td className='py-4 pr-4 font-semibold text-sky-700'>
                            ${Number(listing.offer ? listing.discountPrice : listing.regularPrice || 0).toLocaleString('en-US')}
                          </td>
                          <td className='py-4 pr-4'>
                            <div className='flex gap-2'>
                              <Link
                                to={`/listing/${listing._id}`}
                                className='h-10 w-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center'
                                title='View listing'
                              >
                                <FaExternalLinkAlt className='text-xs' />
                              </Link>
                              <Link
                                to={`/update-listing/${listing._id}`}
                                className='h-10 w-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center'
                                title='Edit listing'
                              >
                                <FaEdit />
                              </Link>
                              <button
                                type='button'
                                onClick={() => deleteListing(listing._id)}
                                className='h-10 w-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center'
                                title='Delete listing'
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        <p className='text-center text-xs text-sky-700/40 mt-8'>
          RoomPlug admin tools · Signed in as {currentUser?.username}
        </p>
      </div>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className='bg-white border border-sky-100 rounded-[28px] p-5 shadow-sm'>
      <p className='text-sm text-sky-700/60'>{label}</p>
      <p className='text-3xl font-bold text-sky-950 mt-1'>{value}</p>
    </div>
  );
}
