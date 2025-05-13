const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['tenis', 'poloche', 'pantalones', 'gorras'], // Definir las categorías permitidas
  },
  quantity: {
    type: Number,
    required: true,
  },
  sizes: {
    type: [String], // Un array de strings para las tallas
    default: [], // Por defecto es un array vacío
  },
  images: {
    main: {
      type: String,
      required: true,
    },
    secondary: {
      type: [String], // Un array de URLs de imágenes secundarias
      default: [],
    },
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
