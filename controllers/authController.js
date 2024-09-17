const jwt = require('jsonwebtoken');
const User = require('../models/User');

// تسجيل الدخول
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // التحقق من وجود المستخدم
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // التحقق من صحة كلمة المرور
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // إنشاء رمز JWT
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};



// إنشاء مستخدم جديد  
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // التحقق من وجود البريد الإلكتروني بالفعل
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    // إنشاء مستخدم جديد
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

module.exports = {
  login,
  createUser,
};

