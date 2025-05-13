// lopezstore/backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { loginAdmin, createAdmin } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Ruta de login para el admin
router.post('/login', loginAdmin);

// Ruta para crear un admin
router.post('/create-admin', createAdmin); // Esta ruta no requiere autenticación

module.exports = router;
