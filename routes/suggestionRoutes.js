const express = require('express');
const authenticateAndAuthorize = require('../Middleware/authMiddleware');
const SuggestionController = require('../controllers/suggestionController.js');

const router = express.Router();
// const {createSuggestion,
//     getAllSuggestions,
//     getSuggestionsByStatus,
//     updateSuggestionStatus,
//     getApprovedSuggestions
//   } =require('../controllers/SuggestionController');


// 1. إضافة اقتراح جديد
router.post('/', SuggestionController.createSuggestion);

// 2. جلب جميع الاقتراحات
router.get('/',authenticateAndAuthorize(['manager']) , SuggestionController.getAllSuggestions);
router.get('/Approved', SuggestionController.getApprovedSuggestions);

// 3. جلب الاقتراحات بناءً على حالتها
router.get('/status/:status',authenticateAndAuthorize(['manager']),SuggestionController.getSuggestionsByStatus);

// 4. تحديث حالة اقتراح (للإدمن)
router.put('/status/:id',authenticateAndAuthorize(['manager']) ,SuggestionController.updateSuggestionStatus);

module.exports = router;
