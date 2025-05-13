const mongoose = require('mongoose');

// Definir el esquema del cliente
const clienteSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: false // La talla puede ser opcional
  },
  productName: {
    type: String,
    required: true
  }
});

// Crear y exportar el modelo Cliente
const Cliente = mongoose.model('Cliente', clienteSchema);
module.exports = Cliente;
