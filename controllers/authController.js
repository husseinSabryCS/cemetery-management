const User = require('../models/User'); // تأكد من المسار الصحيح
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();
// إعداد Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'husseinsabry525@gmail.com', // البريد الإلكتروني الخاص بك
    pass: 'guro jkjj jphq olcv', // كلمة المرور الخاصة بك
  },
});

// دالة لتشفير كلمة المرور
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

   

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.jwt_secret, { expiresIn: '1h' });

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// دالة لإنشاء مستخدم جديد
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // التحقق من وجود البريد الإلكتروني بالفعل
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await hashPassword(password);

    // إنشاء مستخدم جديد مع الدور وكلمة المرور المشفرة
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// دالة لتحديث كلمة المرور وإرسالها عبر البريد الإلكتروني
const updatePasswordAndSendEmail = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // البحث عن المستخدم بواسطة البريد الإلكتروني
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await hashPassword(newPassword);

    // تحديث كلمة المرور في قاعدة البيانات
    user.password = hashedPassword;
    await user.save();

    // إعداد رسالة البريد الإلكتروني
    const mailOptions = {
      from: 'husseinsabry525@gmail.com',
      to: email,
      subject: 'Your New Password',
      text: `Your new password is: ${newPassword}`,
    };

    // إرسال البريد الإلكتروني
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email', error: error.message });
      }
      return res.status(200).json({ message: 'Password updated and sent to email successfully' });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating password', error: error.message });
  }
};

module.exports = { createUser, login, updatePasswordAndSendEmail };
