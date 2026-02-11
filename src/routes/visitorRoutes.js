const express = require('express');
const router = express.Router();
const { addVisitor, updateOutTime, getVisitors } = require('../controllers/visitorController');

// add a new data
router.post('/add', addVisitor);

// update out Time using Id
router.put('/outTime/:visitorId', updateOutTime);

router.post('/getVisitorList', getVisitors);

module.exports = router;
