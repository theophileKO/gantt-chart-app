const express = require('express');
const Chart = require('../models/Chart');
const auth = require('../middleware/auth'); // We'll create this middleware next

const router = express.Router();

// Create a new chart
router.post('/', auth, async (req, res) => {
  try {
    const chart = new Chart({
      ...req.body,
      owner: req.user._id
    });
    await chart.save();
    res.status(201).send(chart);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all charts for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const charts = await Chart.find({ owner: req.user._id });
    res.send(charts);
  } catch (error) {
    res.status(500).send();
  }
});

// Get a specific chart by id
router.get('/:id', auth, async (req, res) => {
  try {
    const chart = await Chart.findOne({ _id: req.params.id, owner: req.user._id });
    if (!chart) {
      return res.status(404).send();
    }
    res.send(chart);
  } catch (error) {
    res.status(500).send();
  }
});

// Update a chart
router.patch('/:id', auth, async (req, res) => {
  try {
    const chart = await Chart.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!chart) {
      return res.status(404).send();
    }
    res.send(chart);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a chart
router.delete('/:id', auth, async (req, res) => {
  try {
    const chart = await Chart.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!chart) {
      return res.status(404).send();
    }
    res.send(chart);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
