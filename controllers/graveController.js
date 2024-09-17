const Grave = require('../models/Grave');

// إنشاء مقبرة جديدة
const createGrave = async (req, res) => {
  try {
    const { gender, number, capacity } = req.body; // إضافة السعة
    const newGrave = new Grave({ gender, number, capacity });
    await newGrave.save();
    res.status(201).json(newGrave);
  } catch (error) {
    res.status(500).json({ message: 'Error creating grave', error });
  }
};

// إضافة شخص مدفون
const buryPerson = async (req, res) => {
  try {
    const { name, burialDate } = req.body;
    const grave = await Grave.findById(req.params.id);

    if (!grave) return res.status(404).json({ message: 'Grave not found' });

    // التحقق مما إذا كانت المقبرة ممتلئة
    if (grave.buriedPersons.length >= grave.capacity) {
      return res.status(400).json({ message: 'Grave is full' });
    }

    // إضافة المدفون الجديد
    grave.buriedPersons.push({ name, burialDate });
    grave.availableAfter = new Date(new Date(burialDate).getTime() + 6 * 30 * 24 * 60 * 60 * 1000); // تحديث ليصبح 6 أشهر
    await grave.save();
    res.status(201).json(grave);
  } catch (error) {
    res.status(500).json({ message: 'Error adding burial', error });
  }
};

// التحقق من حالة المقبرة (متاحة أم لا)
const checkAvailability = async (req, res) => {
  try {
    const grave = await Grave.findById(req.params.id);
    if (!grave) return res.status(404).json({ message: 'Grave not found' });

    // إضافة التحقق من السعة
    const available = grave.buriedPersons.length < grave.capacity && (grave.availableAfter && grave.availableAfter <= new Date());
    
    res.json({ available, availableAfter: grave.availableAfter });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching availability', error });
  }
};

// جلب كل المقابر المتاحة
const getAvailableGraves = async (req, res) => {
  try {
    const availableGraves = await Grave.find({
      availableAfter: { $lte: new Date() },
      buriedPersons: { $lt: '$capacity' }, // إضافة شرط السعة
    });
    res.status(200).json(availableGraves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available graves', error });
  }
};

// جلب كل المقابر غير المتاحة وتوضيح متى ستصبح متاحة
const getUnavailableGraves = async (req, res) => {
  try {
    const unavailableGraves = await Grave.find({
      availableAfter: { $gt: new Date() },
    }).select('number availableAfter');

    res.status(200).json(unavailableGraves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unavailable graves', error });
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

// جلب المقابر الخاصة بالنساء
const getFemaleGraves = async (req, res) => {
  try {
    const femaleGraves = await Grave.find({ gender: 'نساء' });
    res.status(200).json(femaleGraves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching female graves', error });
  }
};

// جلب المقابر الخاصة بالرجال
const getMaleGraves = async (req, res) => {
  try {
    const maleGraves = await Grave.find({ gender: 'رجال' });
    res.status(200).json(maleGraves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching male graves', error });
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
  getTotalDeaths, // عدد الوفيات الإجمالي
  getMaleDeaths,  // عدد وفيات الرجال
  getFemaleDeaths, // عدد وفيات النساء
  getRecentBurials // الأشخاص الذين تم دفنهم في آخر 3 أيام
};
