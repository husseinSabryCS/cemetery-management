const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  submittedBy: {
    type: String,  // يمكن تخزين اسم المستخدم أو معرف المستخدم
    required: true,
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

module.exports = Suggestion;
