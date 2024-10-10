const express = require('express');
const authenticateAndAuthorize = require('../Middleware/authMiddleware');
const router = express.Router();
const {createSuggestion,
    getAllSuggestions,
    getSuggestionsByStatus,
    updateSuggestionStatus,
    getApprovedSuggestions
  } =require('../controllers/SuggestionController');


// 1. إضافة اقتراح جديد
router.post('/', createSuggestion);

// 2. جلب جميع الاقتراحات
router.get('/',authenticateAndAuthorize(['manager']), getAllSuggestions);
router.get('/Approved', getApprovedSuggestions);

// 3. جلب الاقتراحات بناءً على حالتها
router.get('/status/:status',authenticateAndAuthorize(['manager']), getSuggestionsByStatus);

// 4. تحديث حالة اقتراح (للإدمن)
router.put('/status/:id',authenticateAndAuthorize(['manager']) ,updateSuggestionStatus);

module.exports = router;
