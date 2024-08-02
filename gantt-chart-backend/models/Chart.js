const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  id: Number,
  name: String,
  start: Date,
  end: Date,
  progress: Number,
  color: String,
  parentId: Number
});

const ChartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tasks: [TaskSchema]
});

module.exports = mongoose.model('Chart', ChartSchema);