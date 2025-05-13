const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const clienteRoutes = require('./routes/clienteRoutes'); // Ruta para el cliente
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api', clienteRoutes); // Ruta para manejar los clientes

// Ruta raíz para servir 'lopezstore.html'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/lopezstore.html'));
});

// Ruta de carga de productos manual (formulario)
app.get('/loginAdmin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/loginAdmin.html'));
});



// Middleware de errores
app.use(notFound);
app.use(errorHandler);


// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
