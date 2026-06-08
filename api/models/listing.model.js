import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    // Public location shown to students, e.g. Mount Pleasant, Hatcliff, Borrowdale
    address: {
      type: String,
      required: true,
    },

    // Hidden until payment/access process
    exactAddress: {
      type: String,
      default: '',
    },

    landlordName: {
      type: String,
      default: '',
    },

    landlordPhone: {
      type: String,
      default: '',
    },

    landlordEmail: {
      type: String,
      default: '',
    },

    regularPrice: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    nonRefundableDeposit: {
      type: Number,
      default: 0,
    },

    bathrooms: {
      type: Number,
      required: true,
    },

    bedrooms: {
      type: Number,
      required: true,
    },

    roomAllocation: {
      type: Number,
      default: 1,
    },

    genderAllowed: {
      type: String,
      default: 'any',
    },

    spaceLevel: {
      type: String,
      default: '',
    },

    distanceToCampus: {
      type: String,
      default: '',
    },

    timeToCampus: {
      type: String,
      default: '',
    },

    transportType: {
      type: String,
      default: '',
    },

    transportCost: {
      type: Number,
      default: 0,
    },

    wifi: {
      type: String,
      default: '',
    },

    zesaBackup: {
      type: String,
      default: '',
    },

    waterSource: {
      type: String,
      default: '',
    },

    geyser: {
      type: Boolean,
      default: false,
    },

    lounge: {
      type: Boolean,
      default: false,
    },

    fittedKitchen: {
      type: Boolean,
      default: false,
    },

    cleaningServices: {
      type: Boolean,
      default: false,
    },

    refrigerator: {
      type: Boolean,
      default: false,
    },

    microwave: {
      type: Boolean,
      default: false,
    },

    wardrobes: {
      type: Boolean,
      default: false,
    },

    studyDesk: {
      type: Boolean,
      default: false,
    },

    parking: {
      type: Boolean,
      required: true,
    },

    furnished: {
      type: Boolean,
      required: true,
    },

    swimmingPool: {
      type: Boolean,
      default: false,
    },

    security: {
      type: String,
      default: '',
    },

    cookingType: {
      type: String,
      default: '',
    },

    curfew: {
      type: String,
      default: 'no',
    },

    curfewTime: {
      type: String,
      default: '',
    },

    visitorsAllowed: {
      type: String,
      default: 'not specified',
    },

    visitorsGender: {
      type: String,
      default: '',
    },

    type: {
      type: String,
      required: true,
    },

    offer: {
      type: Boolean,
      required: true,
    },

    imageUrls: {
      type: Array,
      required: true,
    },

    videoUrl: {
      type: String,
      default: '',
    },

    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;