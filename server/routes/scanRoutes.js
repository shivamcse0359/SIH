const express = require('express');
const rateLimit = require('express-rate-limit');
const { scanUrl, getHistory } = require('../controllers/scanController');

const router = express.Router();

const scanLimiter = rateLimit({
  windowMs: (Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many scan requests. Please wait a few minutes and try again.' },
});

router.post('/scan', scanLimiter, scanUrl);
router.get('/history', getHistory);

module.exports = router;
