// routes/articleRoutes.js

const express = require('express');
const router = express.Router();
const { createArticle, getAllArticles,deleteArticle ,getArticleById} = require('../controllers/articleController');
const authenticateAndAuthorize = require('../Middleware/authMiddleware');
// إنشاء مقال جديد
router.post('/',authenticateAndAuthorize(['manager']), createArticle);

// جلب كل المقالات
router.get('/', getAllArticles);
router.get('/ArticleDetail/:id', getArticleById); // لجلب مقال بواسطة ID
// حذف مقال
router.delete('/:id',authenticateAndAuthorize(['manager']), deleteArticle);

module.exports = router; 
