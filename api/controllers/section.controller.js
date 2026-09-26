import Section from '../models/section.model.js';
import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const DEFAULT_SECTIONS = [
  {
    name: 'Student Accommodation',
    slug: 'student-accommodation',
    description: 'Rooms and shared accommodation designed around student needs and campus access.',
    bookingFee: 0,
    displayOrder: 1,
  },
  {
    name: 'Lodges',
    slug: 'lodges',
    description: 'Lodges and short-to-medium stay accommodation available through RoomPlug.',
    bookingFee: 0,
    displayOrder: 2,
  },
  {
    name: 'General Accommodation',
    slug: 'general-accommodation',
    description: 'Accommodation for regular tenants and anyone looking for a place to stay.',
    bookingFee: 0,
    displayOrder: 3,
  },
  {
    name: 'BnBs',
    slug: 'bnbs',
    description: 'Bed and breakfast stays and other flexible accommodation options.',
    bookingFee: 0,
    displayOrder: 4,
  },
  {
    name: 'Property & Stands',
    slug: 'property-and-stands',
    description: 'Houses, land, stands and other property opportunities to browse and list through RoomPlug.',
    bookingFee: 0,
    displayOrder: 5,
  },
];

const checkAdmin = async (userId) => {
  const user = await User.findById(userId);
  return user?.isAdmin === true;
};

const generalListingFilter = {
  $or: [
    { section: 'general-accommodation' },
    { section: { $exists: false } },
    { section: '' },
  ],
};

export const ensureDefaultSections = async () => {
  await Promise.all(
    DEFAULT_SECTIONS.map((section) =>
      Section.findOneAndUpdate(
        { slug: section.slug },
        { $setOnInsert: section },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  );

  // One-time compatibility migration for listings created before sections existed.
  await Listing.updateMany(
    {
      $or: [{ section: { $exists: false } }, { section: '' }, { section: null }],
    },
    { $set: { section: 'general-accommodation' } }
  );
};

const withCounts = async (sections) => {
  return Promise.all(
    sections.map(async (section) => {
      const listingCount =
        section.slug === 'general-accommodation'
          ? await Listing.countDocuments(generalListingFilter)
          : await Listing.countDocuments({ section: section.slug });

      return {
        ...section,
        listingCount,
      };
    })
  );
};

export const getSections = async (req, res, next) => {
  try {
    await ensureDefaultSections();

    const sections = await Section.find({ active: true })
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    return res.status(200).json(await withCounts(sections));
  } catch (error) {
    next(error);
  }
};

export const getAdminSections = async (req, res, next) => {
  try {
    const isAdmin = await checkAdmin(req.user.id);

    if (!isAdmin) {
      return next(errorHandler(403, 'Only admins can manage accommodation sections!'));
    }

    await ensureDefaultSections();

    const sections = await Section.find()
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    return res.status(200).json(await withCounts(sections));
  } catch (error) {
    next(error);
  }
};

export const getSection = async (req, res, next) => {
  try {
    await ensureDefaultSections();

    const slug = String(req.params.slug || '').trim().toLowerCase();
    const section = await Section.findOne({ slug, active: true }).lean();

    if (!section) {
      return next(errorHandler(404, 'Accommodation section not found!'));
    }

    const listingFilter =
      slug === 'general-accommodation'
        ? generalListingFilter
        : { section: slug };

    const listingCount = await Listing.countDocuments(listingFilter);
    const listings = await Listing.find(listingFilter)
      .sort({ createdAt: -1 })
      .limit(1000);

    return res.status(200).json({
      section,
      count: listingCount,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

const makeSlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const createSection = async (req, res, next) => {
  try {
    const isAdmin = await checkAdmin(req.user.id);

    if (!isAdmin) {
      return next(errorHandler(403, 'Only admins can create accommodation sections!'));
    }

    const name = String(req.body.name || '').trim();
    const description = String(req.body.description || '').trim();
    const bookingFee = Number(req.body.bookingFee) || 0;
    const displayOrder = Number(req.body.displayOrder) || 0;
    const active =
      req.body.active === undefined
        ? true
        : req.body.active === true || req.body.active === 'true';

    if (!name) {
      return next(errorHandler(400, 'Section name is required.'));
    }

    if (bookingFee < 0 || displayOrder < 0) {
      return next(errorHandler(400, 'Booking fee and display order cannot be negative.'));
    }

    const baseSlug = makeSlug(name);
    let slug = baseSlug || `section-${Date.now()}`;
    let suffix = 2;

    while (await Section.exists({ slug })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const section = await Section.create({
      name,
      slug,
      description,
      bookingFee,
      displayOrder,
      active,
    });

    res.status(201).json(section);
  } catch (error) {
    next(error);
  }
};

export const updateSection = async (req, res, next) => {
  try {
    const isAdmin = await checkAdmin(req.user.id);

    if (!isAdmin) {
      return next(errorHandler(403, 'Only admins can update accommodation sections!'));
    }

    const section = await Section.findOne({ slug: req.params.slug });

    if (!section) {
      return next(errorHandler(404, 'Accommodation section not found!'));
    }

    const updates = {};

    if (req.body.name !== undefined) {
      const name = String(req.body.name).trim();
      if (!name) {
        return next(errorHandler(400, 'Section name cannot be empty.'));
      }
      updates.name = name;
    }

    if (req.body.description !== undefined) {
      updates.description = String(req.body.description).trim();
    }

    if (req.body.bookingFee !== undefined) {
      const bookingFee = Number(req.body.bookingFee);
      if (!Number.isFinite(bookingFee) || bookingFee < 0) {
        return next(errorHandler(400, 'Booking fee must be a valid number of 0 or more.'));
      }
      updates.bookingFee = bookingFee;
    }

    if (req.body.displayOrder !== undefined) {
      const displayOrder = Number(req.body.displayOrder);
      if (!Number.isFinite(displayOrder) || displayOrder < 0) {
        return next(errorHandler(400, 'Display order must be a valid number of 0 or more.'));
      }
      updates.displayOrder = displayOrder;
    }

    if (req.body.active !== undefined) {
      updates.active = Boolean(req.body.active);
    }

    const updated = await Section.findOneAndUpdate(
      { slug: req.params.slug },
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};
