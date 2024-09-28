// models/articleModel.js

const mongoose = require('mongoose');

// إنشاء Schema للمقالات
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
}, {
  timestamps: true // لإضافة تاريخ الإنشاء والتعديل تلقائيًا
});

module.exports = mongoose.model('Article', articleSchema);
