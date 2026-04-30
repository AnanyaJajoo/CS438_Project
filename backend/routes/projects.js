const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Stats endpoint must come before /:id
router.get('/stats', async (req, res) => {
  try {
    const projects = await Project.find().populate('lab').populate('researchers');

    const total = projects.length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const avgBudget = total > 0
      ? projects.reduce((sum, p) => sum + (p.budget || 0), 0) / total
      : 0;

    // Average researchers per lab
    const labStats = {};
    projects.forEach(p => {
      if (p.lab) {
        const key = p.lab._id.toString();
        if (!labStats[key]) labStats[key] = { name: p.lab.name, totalResearchers: 0, projectCount: 0 };
        labStats[key].totalResearchers += p.researchers.length;
        labStats[key].projectCount += 1;
      }
    });

    const labAvgResearchers = Object.values(labStats).map(d => ({
      lab: d.name,
      avgResearchers: d.projectCount > 0 ? (d.totalResearchers / d.projectCount).toFixed(1) : '0'
    }));

    res.json({
      total,
      completed,
      ongoing: total - completed,
      percentCompleted: total > 0 ? ((completed / total) * 100).toFixed(1) : '0',
      avgBudget: avgBudget.toFixed(2),
      labAvgResearchers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, labId, minBudget, maxBudget } = req.query;
    const filter = {};

    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }
    if (labId) filter.lab = labId;
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = Number(minBudget);
      if (maxBudget) filter.budget.$lte = Number(maxBudget);
    }
    // '{ $where: ... }' 
    const projects = await Project.find(filter)
      .populate('lab')
      .populate('researchers')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    await project.populate(['lab', 'researchers']);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('lab')
      .populate('researchers');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
