const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const RestPasswordController = require('../controllers/RestPasswordController');
const authenticateAndAuthorize = require('../Middleware/authMiddleware');
router.post('/login', authController.login);
// إنشاء مستخدم جديد, authenticateAndAuthorize(['manager'])
router.post('/register',authController.createUser);
router.post('/update-password',authController.updatePasswordAndSendEmail);
module.exports = router;
