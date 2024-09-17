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
  capacity: {
    type: Number,
    required: true, // السعة القصوى للمقبرة
  },
  buriedPersons: [
    {
      name: { type: String, required: true },
      burialDate: { type: Date, required: true },
    },
  ],
  availableAfter: {   
    type: Date,
    default: function () {
      if (this.buriedPersons.length > 0) {
        // حساب 6 أشهر (180 يومًا) بعد تاريخ آخر دفن
        return new Date(this.buriedPersons[this.buriedPersons.length - 1].burialDate.getTime() + 6 * 30 * 24 * 60 * 60 * 1000);
      }
      return null;
    },
  },
  status: {
    type: String,
    default: function () {
      const currentDate = new Date();
      if (this.buriedPersons.length >= this.capacity) {
        return 'غير متاحة'; // إذا كانت المقبرة ممتلئة
      } 
      
      if (this.buriedPersons.length > 0) {
        const lastBurialDate = this.buriedPersons[this.buriedPersons.length - 1].burialDate;
        const sixMonthsAfterLastBurial = new Date(lastBurialDate.getTime() + 6 * 30 * 24 * 60 * 60 * 1000); // تقريب 6 أشهر

        // إذا مر 6 أشهر تكون الحالة "متاحة"، وإذا لم تمر تكون "غير متاحة"
        return currentDate >= sixMonthsAfterLastBurial ? 'متاحة' : 'غير متاحة';
      }
      return 'متاحة'; // إذا لم يكن هناك دفن، تكون متاحة افتراضيًا
    },
  },
});

const Grave = mongoose.model('Grave', graveSchema);
module.exports = Grave;
