const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

const visitorSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: String   // ✅ override default ObjectId
    // },
    visitorId: {
      type: String,
    //   default: uuidv4,
      unique: true,
      immutable: true,
      index: true,
      required: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    mobileNumber: {
      type: String,
      required: true
    },
    purposeOfVisit: {
      type: String,
      required: true
    },
    visitDate: {
      type: Date,
      required: true
    },
    inTime: {
      type: String,
      required: true
    },
    outTime: {
      type: String,
      required: true,
    //   default: ""
    }
  },
  { timestamps: true }
);

/* Index to improve daily lookup */
visitorSchema.index({ mobileNumber: 1, visitDate: 1 });

module.exports = mongoose.model('Visitor', visitorSchema);
