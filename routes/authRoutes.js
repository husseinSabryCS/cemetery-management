const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const authenticateAndAuthorize = require('../Middleware/authMiddleware');
router.post('/login', authController.login);
// إنشاء مستخدم جديد,
router.post('/register', authenticateAndAuthorize(['manager']),authController.createUser);
router.post('/update-password', authenticateAndAuthorize(['manager']),authController.updatePasswordAndSendEmail);
module.exports = router;
