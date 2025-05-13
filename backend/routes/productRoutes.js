const express = require('express');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, filterProducts } = require('../controllers/productController');
const router = express.Router();
const multer = require('multer');
const { protectAdmin } = require('../middleware/authMiddleware'); // Importar el middleware

// Configuración de multer para manejar archivos (sin almacenamiento local)
const storage = multer.memoryStorage(); // Usamos memoria en lugar de almacenamiento local
const upload = multer({ storage });

// Rutas para productos
router.get('/products', getAllProducts); // Ver todos los productos (puede estar disponible para todos los usuarios)
router.get('/products/:id', getProductById); // Ver un producto por ID (puede estar disponible para todos los usuarios)
router.post('/products', protectAdmin, upload.fields([{ name: 'image' }, { name: 'secondaryImages' }]), createProduct); // Crear un nuevo producto (solo admin)
router.put('/products/:id', protectAdmin, upload.fields([{ name: 'image' }, { name: 'secondaryImages' }]), updateProduct);
router.delete('/products/:id', protectAdmin, deleteProduct); // Eliminar un producto (solo admin)


// Definir la ruta para obtener detalles del producto
router.get('/product-detail/:id', getProductById);


// GET filtrado avanzado
router.get('/filter', filterProducts);



module.exports = router;
