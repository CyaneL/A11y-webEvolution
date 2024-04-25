const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArchiveResultSchema = new Schema({
  url: String,
  startDate: Date,
  endDate: Date,
  collapseValue: String,
  data: {}, 
  createdAt: { type: Date, default: Date.now, expires: '30d' }
});

module.exports = mongoose.model('ArchiveResult', ArchiveResultSchema);