const jwt = require('jsonwebtoken');

// Middleware للتحقق من صلاحية التوكن والأدوار
const authenticateAndAuthorize = (allowedRoles) => {
  return (req, res, next) => {
    // الحصول على التوكن من الهيدر
    const token = req.headers['authorization']?.split(' ')[1];

    // إذا لم يتم توفير التوكن، أعد رسالة خطأ
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // التحقق من التوكن
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      // إذا كان هناك خطأ في التوكن
      if (err) {
        return res.status(401).json({ message: 'Failed to authenticate token' });
      }

      // استخراج الـ userId و الـ role من التوكن
      req.userId = decoded.userId;
      req.userRole = decoded.role; // نفترض أن التوكن يحتوي على دور المستخدم

      // التحقق مما إذا كان دور المستخدم موجود ضمن الأدوار المسموح بها
      if (allowedRoles && !allowedRoles.includes(req.userRole)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // السماح بالوصول للروت التالي
      next();
    });
  };
};

module.exports = authenticateAndAuthorize;
