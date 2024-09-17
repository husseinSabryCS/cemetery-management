const mongoose = require('mongoose');

const graveSchema = new mongoose.Schema({
  gender: {
    type: String,
    required: true,
    enum: ['رجال', 'نساء', 'عظام'],
  },
  number: {
    type: Number,
    required: true,
  },
  buriedPersons: [
    {
      name: { type: String, required: true },
      burialDate: { type: Date, required: true },
    },
  ],
  availableAfter: {   
    type: Date,
  },
  status: {
    type: String,
    default: 'متاحة', // تعيين الحالة الافتراضية
    enum: ['متاحة', 'غير متاحة', 'ممتلئة'],
  },
});

const Grave = mongoose.model('Grave', graveSchema);
module.exports = Grave;
