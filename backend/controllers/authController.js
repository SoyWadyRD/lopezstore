// lopezstore/backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Login de administrador
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && user.isAdmin && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas o no eres admin' });
  }
};

// Crear admin (solo para usar 1 vez o en desarrollo)
const createAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Verificar si el usuario ya existe
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }

  // Crear el nuevo usuario administrador
  const user = await User.create({
    username,
    password,
    isAdmin: true,  // Asegúrate de que este usuario sea admin
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),  // Generar un token para el nuevo administrador
    });
  } else {
    res.status(400).json({ message: 'Datos inválidos' });
  }
};

module.exports = {
  loginAdmin,
  createAdmin,
};
