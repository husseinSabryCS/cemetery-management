const Grave = require('../models/Grave');
const cron = require('node-cron');
// إنشاء مقبرة جديدة
const createGrave = async (req, res) => {
  try {
    const { gender, number } = req.body;
    const newGrave = new Grave({ gender, number });
    await newGrave.save();
    res.status(201).json(newGrave);
  } catch (error) {
    res.status(500).json({ message: 'Error creating grave', error });
  }
};

// إضافة شخص مدفون وتحديث حالة المقبرة إذا كانت ممتلئة
const buryPerson = async (req, res) => {
  try {
    const { name, burialDate } = req.body;
    const grave = await Grave.findById(req.params.id);

    if (!grave) return res.status(404).json({ message: 'Grave not found' });

    // Handle cases for unavailable graves
    if (grave.status === 'غير متاحة') {
      const lastBurialDate = grave.buriedPersons[grave.buriedPersons.length - 1].burialDate;
      const sixMonthsLater = new Date(new Date(lastBurialDate).getTime() + 6 * 30 * 24 * 60 * 60 * 1000);
      const daysUntilAvailable = Math.ceil((sixMonthsLater - new Date()) / (1000 * 60 * 60 * 24));
      if(daysUntilAvailable>0){
      return res.status(400).json({
        message: 'المقبرة غير متاحة في الوقت الحالي',
        daysUntilAvailable: `ستكون متاحة بعد ${daysUntilAvailable} يوم/أيام.`
      });
      // حساب المدة المتبقية بناءً على تاريخ آخر دفن
    }
    }

    // Handle case for full graves
    if (grave.status === 'ممتلئة') {
      return res.status(400).json({ message: 'المقبرة قد امتلأت' });
    }

    // Add the new burial
    grave.buriedPersons.push({ name, burialDate });

    // Update grave status after new burial
    grave.status = 'غير متاحة';
    grave.availableAfter = new Date(new Date(burialDate).getTime() + 6 * 30 * 24 * 60 * 60 * 1000); // Available after 6 months

    await grave.save();
    return res.status(201).json(grave);
  } catch (error) {
    return res.status(500).json({ message: 'Error adding burial', error });
  }
};



// التحقق من حالة المقبرة (متاحة أم لا)
const checkAvailability = async (req, res) => {
  try {
    const grave = await Grave.findById(req.params.id);
    if (!grave) return res.status(404).json({ message: 'Grave not found' });

    const available = grave.availableAfter <= new Date();
    
    res.json({ available, availableAfter: grave.availableAfter }); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching availability', error });
  }
};

// جلب كل المقابر المتاحة
const getAvailableGraves = async (req, res) => {
  try {
    const availableGraves = await Grave.find({ status: 'متاحة' }); // تعديل بناء الجملة الصحيح
    res.status(200).json(availableGraves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available graves', error });
  }
};


// جلب كل المقابر غير المتاحة وتوضيح متى ستصبح متاحة
const getUnavailableGraves = async (req, res) => {
  try {
    const availableGraves = await Grave.find({ status: 'غير متاحة' }); // تعديل بناء الجملة الصحيح
    res.status(200).json(availableGraves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available graves', error });
  }
};

// جلب جميع المقابر
const getAllGraves = async (req, res) => {
  try {
    const graves = await Grave.find();
    res.status(200).json(graves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching graves', error });
  }
};

// جلب جميع المقابر مع الأشخاص المدفونين في كل منها
const getGravesWithBuriedPersons = async (req, res) => {
  try {
    const gravesWithBuriedPersons = await Grave.find().select('number gender buriedPersons');
    res.status(200).json(gravesWithBuriedPersons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching graves with buried persons', error });
  }
};
// جلب تفاصيل مقبرة معينة عن طريق ID
const getGraveById = async (req, res) => {
  try {
    const graveId = req.params.id; // الحصول على ID من الطلب
    const grave = await Grave.findById(graveId).select('number gender buriedPersons');

    if (!grave) {
      return res.status(404).json({ message: 'Grave not found' }); // في حال عدم العثور على المقبرة
    }

    res.status(200).json(grave); // إعادة تفاصيل المقبرة في حالة النجاح
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grave details', error });
  }
};


const getFemaleGraves = async (req, res) => {
  try {
    const femaleGraves = await Grave.find({ gender: 'نساء' });

    const gravesWithAvailability = femaleGraves.map(grave => {
      const daysUntilAvailable = grave.availableAfter 
        ? Math.ceil((new Date(grave.availableAfter) - new Date()) / (1000 * 60 * 60 * 24))
        : null; // إذا لم يكن حقل availableAfter موجودًا

      return {
        ...grave.toObject(), // إرجاع جميع تفاصيل القبر
        daysUntilAvailable, // إضافة عدد الأيام المتبقية
      };
    });

    res.status(200).json(gravesWithAvailability);
  } catch (error) {
    console.error('Backend Error:', error); // تسجيل الخطأ الفعلي
    res.status(500).json({ message: 'Error fetching female graves', error: error.message });
  }
};

// جلب المقابر الخاصة بالرجال
const getMaleGraves = async (req, res) => {
  try {
    const maleGraves = await Grave.find({ gender: 'رجال' });

    const gravesWithAvailability = maleGraves.map(grave => {
      const daysUntilAvailable = grave.availableAfter 
        ? Math.ceil((new Date(grave.availableAfter) - new Date()) / (1000 * 60 * 60 * 24))
        : null; // إذا لم يكن حقل availableAfter موجودًا

      return {
        ...grave.toObject(), // إرجاع جميع تفاصيل القبر
        daysUntilAvailable, // إضافة عدد الأيام المتبقية
      };
    });

    res.status(200).json(gravesWithAvailability);
  } catch (error) {
    console.error('Backend Error:', error); // تسجيل الخطأ الفعلي
    res.status(500).json({ message: 'Error fetching male graves', error: error.message });
  }
};

// جلب المقابر الخاصة بالعظام
const getBoneGraves = async (req, res) => {
  try {
    const boneGraves = await Grave.find({ gender: 'عظام' });
    res.status(200).json(boneGraves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bone graves', error });
  }
};

// فانكشن لحساب عدد الوفيات
const getTotalDeaths = async (req, res) => {
  try {
    const graves = await Grave.find();
    const totalDeaths = graves.reduce((total, grave) => total + grave.buriedPersons.length, 0);
    res.status(200).json({ totalDeaths });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching total deaths', error });
  }
};

// فانكشن لحساب عدد وفيات الرجال
const getMaleDeaths = async (req, res) => {
  try {
    const maleGraves = await Grave.find({ gender: 'رجال' });
    const maleDeaths = maleGraves.reduce((total, grave) => total + grave.buriedPersons.length, 0);
    res.status(200).json({ maleDeaths });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching male deaths', error });
  }
};

// فانكشن لحساب عدد وفيات النساء
const getFemaleDeaths = async (req, res) => {
  try {
    const femaleGraves = await Grave.find({ gender: 'نساء' });
    const femaleDeaths = femaleGraves.reduce((total, grave) => total + grave.buriedPersons.length, 0);
    res.status(200).json({ femaleDeaths });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching female deaths', error });
  }
};

// فانكشن لجلب كل الأشخاص الذين تم دفنهم في آخر 3 أيام
const getRecentBurials = async (req, res) => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const recentBurials = await Grave.find({
      'buriedPersons.burialDate': { $gte: threeDaysAgo },
    }).select('number buriedPersons');

    res.status(200).json(recentBurials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent burials', error });
  }
};

// فانكشن لتحديث حالة المقبرة لتصبح ممتلئة
const updateGraveToFull = async (req, res) => {
  try {
    const graveId = req.params.id;
    
    // العثور على المقبرة
    const grave = await Grave.findById(graveId);

    if (!grave) return res.status(404).json({ message: 'Grave not found' });

    // التحقق من حالة المقبرة لتجنب التكرار
    if (grave.status === 'ممتلئة') {
      return res.status(400).json({ message: 'Grave is already marked as full' });
    }

    // تحديث حالة المقبرة لتصبح ممتلئة
    grave.status = 'ممتلئة'; // تعيين الحالة كممتلئة
    grave.availableAfter = null; // المقبرة لن تكون متاحة مجددًا

    await grave.save();
    res.status(200).json(grave);
  } catch (error) {
    res.status(500).json({ message: 'Error updating grave to full', error });
  }
};



// جدولة المهمة لتعمل كل يوم في منتصف الليل (00:00)
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running cron job to update grave statuses...');

    // البحث عن المقابر غير المتاحة
    const graves = await Grave.find({ status: 'غير متاحة' });
    if(graves.length<=0){
   console.log("done");
         

    }
   
    graves.forEach(async (grave) => {
      if (grave.buriedPersons && grave.buriedPersons.length > 0) {
        // احصل على تاريخ آخر دفن
        const lastBurialDate = grave.buriedPersons[grave.buriedPersons.length - 1].burialDate;
        const sixMonthsLater = new Date(new Date(lastBurialDate).getTime() + 6 * 30 * 24 * 60 * 60 * 1000);

        // التحقق مما إذا مرت 6 أشهر على آخر دفن
        if (new Date() >= sixMonthsLater) {
          grave.status = 'متاحة';  // تحديث الحالة إلى "متاحة"
          grave.availableAfter = null;  // إزالة تاريخ الإتاحة لأنه لم يعد ضروريًا
          await grave.save();  // حفظ التحديثات في قاعدة البيانات
          console.log(`Updated grave ID ${grave._id} to 'متاحة'`);
        }
      } else {
        console.log(`Grave ID ${grave._id} has no buried persons.`);
      }
    });
  } catch (error) {
    console.error('Error updating grave statuses:', error);
  }
});



module.exports = {
  createGrave,
  buryPerson,
  checkAvailability,
  getAvailableGraves,
  getUnavailableGraves,
  getAllGraves,
  getGravesWithBuriedPersons,
  getFemaleGraves,
  getMaleGraves,
  getBoneGraves,
  getTotalDeaths,
  getMaleDeaths,
  getFemaleDeaths,
  getRecentBurials,
  updateGraveToFull,
  getGraveById
};
