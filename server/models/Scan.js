const mongoose = require('mongoose');

// Deliberately minimal - we store only what's needed to show scan history,
// no IP addresses, user agents, or other identifying information.
const scanSchema = new mongoose.Schema({
  url: { type: String, required: true },
  domain: { type: String, required: true },
  verdict: { type: String, required: true },
  riskScore: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Scan', scanSchema);
