const Cliente = require('../models/Cliente'); // Importamos el modelo del Cliente

// Controlador para crear un cliente
const createCliente = async (req, res) => {
  const { fullName, phoneNumber, size, productName } = req.body;

  // Validación de los campos
  if (!fullName || !phoneNumber || !productName) {
    return res.status(400).json({ message: 'Nombre completo, número de teléfono y nombre del producto son requeridos' });
  }

  try {
    // Crear un nuevo cliente
    const newCliente = new Cliente({
      fullName,
      phoneNumber,
      size,
      productName
    });

    // Guardar el cliente en la base de datos
    await newCliente.save();

    // Enviar la respuesta de éxito
    res.status(201).json({ message: 'Cliente guardado exitosamente', cliente: newCliente });
  } catch (error) {
    console.error('Error al guardar el cliente:', error);
    res.status(500).json({ message: 'Error al guardar el cliente', error });
  }
};

module.exports = {
  createCliente
};
