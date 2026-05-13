const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  budget: { type: Number, default: 0 },
  status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab' },
  researchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
}, { timestamps: true });

// Supports: GET /projects?labId=... filter and the stats report (avgResearchers per lab)
projectSchema.index({ lab: 1 });
// Supports: GET /projects?startDate=...&endDate=... date-range filter
projectSchema.index({ startDate: 1 });
// Supports: GET /projects?minBudget=...&maxBudget=... budget filter and avgBudget stat
projectSchema.index({ budget: 1 });
// Supports: stats report counting ongoing vs completed projects
projectSchema.index({ status: 1 });

module.exports = mongoose.model('Project', projectSchema);


//{$gt: ''}