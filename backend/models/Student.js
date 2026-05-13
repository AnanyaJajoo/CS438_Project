const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String },
  year: { type: Number }
});

// Supports: student lookup by email (unique constraint + point queries)
// Supports: filtering/grouping students by department in reports
studentSchema.index({ email: 1 }, { unique: true });
studentSchema.index({ department: 1 });

module.exports = mongoose.model('Student', studentSchema);

//{$gt: ''}