// lopezstore/backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');

      if (user && user.isAdmin) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ message: 'No autorizado como admin' });
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token inválido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No hay token, acceso denegado' });
  }
};

module.exports = { protectAdmin };
