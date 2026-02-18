const express = require('express');
const router = express.Router();
const { addVisitor, updateOutTime, getVisitors } = require('../controllers/visitorController');
const authMiddleware = require('../middleware/authMiddleware');

// add a new data
router.post('/add', addVisitor);

// update out Time using Id
router.put('/outTime/:visitorId', authMiddleware, updateOutTime);

router.post('/getVisitorList', authMiddleware, getVisitors);

module.exports = router;
