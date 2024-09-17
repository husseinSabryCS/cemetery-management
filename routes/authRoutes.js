const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
// إنشاء مستخدم جديد
router.post('/register', authController.createUser);

module.exports = router;
