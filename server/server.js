require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const scanRoutes = require('./routes/scanRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  })
);
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'LinkGuard API' });
});

app.use('/api', scanRoutes);

// Optional MongoDB connection for scan history - the app works fine without it
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected - scan history enabled'))
    .catch((err) => console.warn('MongoDB connection failed - scan history disabled:', err.message));
} else {
  console.log('MONGODB_URI not set - scan history disabled');
}

// Central error handler - never leak stack traces or API keys to clients
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Service temporarily unavailable. Please try again shortly.' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

app.listen(PORT, () => {
  console.log(`LinkGuard API running on http://localhost:${PORT}`);
});
