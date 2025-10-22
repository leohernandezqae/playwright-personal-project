const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key'; // same as in authRoutes.js

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user; // save decoded user to request
    next();
  });
}

module.exports = authenticateToken;
