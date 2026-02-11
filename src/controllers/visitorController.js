const Visitor = require('../models/Visitor');
// const Counter = require('../models/counter');

// function for Unique ID
const getNextVisitorId = async (date) => {
//   const counter = await Counter.findByIdAndUpdate(
//     { _id: 'visitorId' },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );
//   return counter.seq;
// };

    const visitDate = new Date(date);
    const ymd = visitDate.toISOString().slice(0,10).replace(/-/g, '');
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `VIS-${ymd}-${rand}`;
};

exports.addVisitor = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      mobileNumber,
      purposeOfVisit,
      date,
      inTime,
      outTime
    } = req.body;

    /* 1. Check null / missing fields */
    if (
      !firstName ||
      !lastName ||
      !mobileNumber ||
      !purposeOfVisit ||
      !date ||
      !inTime
    ) {
      return res.status(400).json({
        isAdded: false,
        message: 'All fields are required'
      });
    }

    /* Normalize date (midnight to midnight) */
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    /* 2. Check mobile number already registered today */
    const existingEntry = await Visitor.findOne({
      mobileNumber,
      visitDate: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingEntry) {
      return res.status(409).json({
        isAdded: false,
        message: 'mobile number is registered for today entry'
      });
    }

    /* Generate SQL-like primary key */
    const visitorId = await getNextVisitorId(date);

    /* 3. Save visitor */
    const newVisitor = new Visitor({
      visitorId,
      firstName,
      lastName,
      mobileNumber,
      purposeOfVisit,
      visitDate: date,
      inTime,
      outTime
    });

    await newVisitor.save();

    return res.status(201).json({
      isAdded: true,
      message: 'Data added successfully'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isAdded: false,
      message: 'Internal Server error'
    });
  }
};

// controller to update the out Time based on Id
exports.updateOutTime = async (req, res) => {
  try {
    const { visitorId } = req.params;
    const { outTime } = req.body;

    if (!outTime) {
      return res.status(400).json({
        updated: false,
        message: 'outTime is required'
      });
    }

    const updatedVisitor = await Visitor.findOneAndUpdate(
      { visitorId: visitorId },
      { outTime },
      { new: true }
    );

    if (!updatedVisitor) {
      return res.status(404).json({
        isAdded: false,
        message: 'Visitor not found'
      });
    }

    return res.json({
      updated: true,
      message: `outTime updated successfully for ${visitorId}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      updated: false,
      message: 'Internal Server error'
    });
  }
};

// Controller to get the visitors available based on pagination
exports.getVisitors = async (req, res) => {
  try {
    const {
      pageNumber = 1,
      pageSize = 10,
      searchName = '',
      date = ''
    } = req.body;

    const page = Number(pageNumber);
    const limit = Number(pageSize);
    const skip = (page - 1) * limit;

    /* Build filter */
    const filter = {};

    if (searchName) {
      filter.$or = [
        { firstName: { $regex: searchName, $options: 'i' } },
        { lastName: { $regex: searchName, $options: 'i' } }
      ];
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.visitDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const totalRecords = await Visitor.countDocuments(filter);

    const visitors = await Visitor.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // important: allows us to modify objects safely

    /* Add filterCount */
    const dataWithFilterCount = visitors.map((doc, index) => ({
      filterCount: skip + index + 1,
      ...doc
    }));

    return res.json({
      pageNumber: page,
      pageSize: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      data: dataWithFilterCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};



