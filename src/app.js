require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

/* ---- CORS CONFIG ---- */
app.use(cors({
  origin: '*',               // change later to frontend domain
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type']
}));

/* Middleware */
app.use(express.json());

/* DB Connection */
connectDB();

/* ---- HEALTH CHECK ---- */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

/* Routes */
app.use('/api/visitors', require('./routes/visitorRoutes'));

/* ---- EXPORT FOR VERCEL ---- */
module.exports = app;

/* ---- LOCAL SERVER ONLY ---- */
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
