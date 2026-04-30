const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Lab = require('../models/Lab');
const Project = require('../models/Project');

router.get('/', async (req, res) => {
  try {
    const labs = await Lab.find().sort({ name: 1 });
    res.json(labs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const lab = new Lab(req.body);
    await lab.save();
    res.status(201).json(lab);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const lab = await Lab.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lab) return res.status(404).json({ error: 'Lab not found' });
    res.json(lab);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  // Transaction with snapshot isolation (MongoDB default): deleting a lab and
  // its associated projects must be atomic — a partial delete would leave orphan
  // projects referencing a non-existent lab, breaking the stats report.
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Project.deleteMany({ lab: req.params.id }, { session });
    const lab = await Lab.findByIdAndDelete(req.params.id, { session });
    if (!lab) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Lab not found' });
    }
    await session.commitTransaction();
    res.json({ message: 'Lab and its projects deleted' });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;
