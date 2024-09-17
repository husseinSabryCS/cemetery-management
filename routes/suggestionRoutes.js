const express = require('express');
const router = express.Router();
const {createSuggestion,
    getAllSuggestions,
    getSuggestionsByStatus,
    updateSuggestionStatus,
  
  } = require('../controllers/SuggestionController');

// 1. إضافة اقتراح جديد
router.post('/', createSuggestion);

// 2. جلب جميع الاقتراحات
router.get('/', getAllSuggestions);

// 3. جلب الاقتراحات بناءً على حالتها
router.get('/status/:status', getSuggestionsByStatus);

// 4. تحديث حالة اقتراح (للإدمن)
router.put('/status/:id', updateSuggestionStatus);

module.exports = router;
