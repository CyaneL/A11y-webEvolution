const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const A11yResultSchema = new Schema({
  url: String,
  timestamp: Date,
  violations: [{
      id: String,
      impact: String,
      description: String,
      help: String,
      helpUrl: String,
      nodes: [{
          html: String,
          target: [String],
          failureSummary: String
      }]
  }]
});

module.exports = mongoose.model('A11yResult', A11yResultSchema);