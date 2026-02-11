require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

/* Middleware */
app.use(express.json());

/* DB Connection */
connectDB();

/* Routes */
app.use('/api/visitors', require('./routes/visitorRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
