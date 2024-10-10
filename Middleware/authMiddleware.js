const jwt = require('jsonwebtoken');

const authenticateAndAuthorize = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.jwt_secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Failed to authenticate token', error: err.message });
      }

      req.userId = decoded.userId;
      req.userRole = decoded.role;
console.log(req.userId,req.userRole);

      if (allowedRoles && !allowedRoles.includes(req.userRole)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    });
  };
};
module.exports = authenticateAndAuthorize;
