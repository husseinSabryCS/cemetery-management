const express = require('express');
const router = express.Router();
const authenticateAndAuthorize = require('../Middleware/authMiddleware');
const {
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
  getGraveById,
  removeBuriedPerson,
  getAvailableGravesCount,
  getUnavailableGravesCount
} = require('../controllers/graveController');

// 1. إنشاء مقبرة جديدة
router.post('/',authenticateAndAuthorize(['admin', 'manager']),createGrave);

// 2. إضافة شخص مدفون لمقبرة معينة
router.post('/:id/bury',authenticateAndAuthorize(['admin', 'manager']), buryPerson);

// 3. التحقق من حالة المقبرة (متاحة أم لا)
router.get('/:id/availability', checkAvailability);

// 4. جلب كل المقابر المتاحة
router.get('/available', getAvailableGraves);

// 5. جلب كل المقابر غير المتاحة وتوضيح متى ستصبح متاحة
router.get('/unavailable', getUnavailableGraves);

// 6. جلب جميع المقابر
router.get('/', getAllGraves);

// 7. جلب جميع المقابر مع الأشخاص المدفونين في كل منها
router.get('/buriedPersons', getGravesWithBuriedPersons);

// 8. جلب المقابر الخاصة بالنساء
router.get('/female', getFemaleGraves);

// 9. جلب المقابر الخاصة بالرجال
router.get('/male', getMaleGraves);

// 10. جلب المقابر الخاصة بالعظام
router.get('/bone', getBoneGraves);

// 11. جلب إجمالي عدد الوفيات في جميع المقابر
router.get('/totalDeaths', getTotalDeaths);

// 12. جلب عدد وفيات الرجال
router.get('/maleDeaths', getMaleDeaths);

// 13. جلب عدد وفيات النساء
router.get('/femaleDeaths', getFemaleDeaths);

// 14. جلب الأشخاص المدفونين في آخر 3 أيام
router.get('/recentBurials', getRecentBurials);

// 15. تحديث حالة المقبرة لتصبح ممتلئة
router.put('/full/:id', authenticateAndAuthorize(['admin', 'manager']),updateGraveToFull);
//. جلب مقبره عن طريق ال id 
router.get('/graves/:id', getGraveById);

router.delete('/:id/remove-buried',authenticateAndAuthorize(['admin', 'manager']), removeBuriedPerson);
// مسار API لعدد المقابر المتاحة
router.get('/available-count', getAvailableGravesCount);

// مسار API لعدد المقابر غير المتاحة
router.get('/unavailable-count', getUnavailableGravesCount);
module.exports = router;

 