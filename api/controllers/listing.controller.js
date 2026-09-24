import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';
import Section from '../models/section.model.js';
import { errorHandler } from '../utils/error.js';

const checkAdmin = async (userId) => {
  const user = await User.findById(userId);
  return user?.isAdmin === true;
};

const normaliseSection = (section) => {
  const value = String(section || '').trim().toLowerCase();
  return value || 'general-accommodation';
};

const getValidActiveSection = async (sectionSlug) => {
  return Section.findOne({ slug: sectionSlug, active: true });
};

export const createListing = async (req, res, next) => {
  try {
    const isAdmin = await checkAdmin(req.user.id);

    if (!isAdmin) {
      return next(errorHandler(403, 'Only admins can create rooms!'));
    }

    if (!req.body.section || !String(req.body.section).trim()) {
      return next(errorHandler(400, 'Please select an accommodation section.'));
    }

    const section = normaliseSection(req.body.section);
    const sectionDoc = await getValidActiveSection(section);

    if (!sectionDoc) {
      return next(errorHandler(400, 'Please select a valid accommodation section.'));
    }

    const listing = await Listing.create({
      ...req.body,
      section,
      userRef: req.user.id,
    });

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const isAdmin = await checkAdmin(req.user.id);

    if (!isAdmin) {
      return next(errorHandler(403, 'Only admins can delete rooms!'));
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const isAdmin = await checkAdmin(req.user.id);

    if (!isAdmin) {
      return next(errorHandler(403, 'Only admins can update rooms!'));
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    const updateData = { ...req.body };

    if (updateData.section !== undefined) {
      const section = normaliseSection(updateData.section);
      const sectionDoc = await Section.findOne({ slug: section });

      if (!sectionDoc) {
        return next(errorHandler(400, 'Please select a valid accommodation section.'));
      }

      updateData.section = section;
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    const sectionSlug = listing.section || 'general-accommodation';
    const sectionDetails = await Section.findOne({ slug: sectionSlug }).lean();

    res.status(200).json({
      ...listing.toObject(),
      section: sectionSlug,
      sectionDetails: sectionDetails || null,
    });
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const rawLimit = parseInt(req.query.limit, 10);
    const rawStartIndex = parseInt(req.query.startIndex, 10);
    const limit = Math.min(Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 9, 1000);
    const startIndex = Number.isFinite(rawStartIndex) && rawStartIndex >= 0 ? rawStartIndex : 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    } else if (offer === 'true') {
      offer = true;
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    } else if (furnished === 'true') {
      furnished = true;
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    } else if (parking === 'true') {
      parking = true;
    }

    let type = req.query.type;
    if (type === undefined || type === 'all' || type === '') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';
    const sort = ['createdAt', 'regularPrice', 'discountPrice', 'name'].includes(req.query.sort)
      ? req.query.sort
      : 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;
    const section = req.query.section ? String(req.query.section).trim().toLowerCase() : '';

    const filter = {
      $and: [
        {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { address: { $regex: searchTerm, $options: 'i' } },
          ],
        },
        { offer },
        { furnished },
        { parking },
        { type },
      ],
    };

    if (section) {
      if (section === 'general-accommodation') {
        filter.$and.push({
          $or: [
            { section },
            { section: { $exists: false } },
            { section: '' },
          ],
        });
      } else {
        filter.$and.push({ section });
      }
    }

    const listings = await Listing.find(filter)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
