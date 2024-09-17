const express = require('express');
const router = express.Router();
const {createSuggestion,
    getAllSuggestions,
    getSuggestionsByStatus,
    updateSuggestionStatus,
  
  } = require('../controllers/SuggestionController');

// 1. إضافة اقتراح جديد
router.post('/suggestions', createSuggestion);

// 2. جلب جميع الاقتراحات
router.get('/suggestions', getAllSuggestions);

// 3. جلب الاقتراحات بناءً على حالتها
router.get('/suggestions/status/:status', getSuggestionsByStatus);

// 4. تحديث حالة اقتراح (للإدمن)
router.put('/suggestions/:id/status', updateSuggestionStatus);

module.exports = router;
