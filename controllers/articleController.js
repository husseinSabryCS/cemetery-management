// controllers/articleController.js

const Article = require('../models/articleModel');

// إنشاء مقال جديد
const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;

    // تحقق من وجود عنوان ونص للمقال
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    // إنشاء المقال وحفظه في قاعدة البيانات
    const newArticle = new Article({ title, content });
    await newArticle.save();

    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: 'Error creating article', error });
  }
};

// جلب جميع المقالات
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }); // جلب المقالات مع ترتيبها حسب الأحدث
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error });
  }
};
const getArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: 'مقال غير موجود.' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب المقال', error });
  }
}; 


// حذف مقال بناءً على الـ ID
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    // محاولة حذف المقال
    const deletedArticle = await Article.findByIdAndDelete(id);

    // التحقق إذا لم يتم العثور على المقال
    if (!deletedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article', error });
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  deleteArticle,
  getArticleById
};
