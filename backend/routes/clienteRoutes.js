const express = require('express');
const router = express.Router();
const { createCliente } = require('../controllers/clienteController'); // Controlador para crear el cliente

// Ruta para crear un cliente
router.post('/clientes', createCliente);

module.exports = router;