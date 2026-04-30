const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, default: 0 }
});

// Supports: lab name lookup and alphabetical listing (GET /labs sorts by name)
labSchema.index({ name: 1 });

module.exports = mongoose.model('Lab', labSchema);
