const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  name: {  // حقل الاسم
    type: String,
    required: true,
  },
  phone: {  // حقل رقم الهاتف
    type: String,
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
