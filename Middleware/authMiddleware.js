const jwt = require('jsonwebtoken');

// Middleware للتحقق من صلاحية التوكن
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token' });

    req.userId = decoded.userId; // يمكنك استخدام req.userId للوصول إلى ID المستخدم
    next();
  });
};

module.exports = authenticate;
