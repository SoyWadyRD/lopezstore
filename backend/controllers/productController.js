const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary'); // Configuración de Cloudinary
const streamifier = require('streamifier');

// Función para subir imágenes a Cloudinary
const uploadFromBuffer = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' }, // Detectar automáticamente el tipo de archivo
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, sizes } = req.body;

    // Verificar si se subieron imágenes
    const mainImage = req.files && req.files.image ? req.files.image[0] : null;
    const secondaryImages = req.files && req.files.secondaryImages ? req.files.secondaryImages : [];

    if (!mainImage) {
      return res.status(400).json({ message: 'Debe proporcionar una imagen principal' });
    }

    // Subir las imágenes a Cloudinary
    const uploadedMainImage = await uploadFromBuffer(mainImage.buffer);

    const uploadedSecondaryImages = [];
    for (const file of secondaryImages) {
      const uploadedImage = await uploadFromBuffer(file.buffer);
      uploadedSecondaryImages.push(uploadedImage.secure_url);
    }

    // Crear el nuevo producto en la base de datos
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      quantity,
      sizes: ['tenis', 'poloche', 'pantalones'].includes(category) ? JSON.parse(sizes) : [], // Solo guardar tallas si corresponde
      images: {
        main: uploadedMainImage.secure_url,
        secondary: uploadedSecondaryImages,
      },
    });

    // Guardar el producto en la base de datos
    await newProduct.save();
    res.status(201).json({ message: 'Producto agregado correctamente', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar el producto', error });
  }
};

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Obtener todos los productos
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};

const mongoose = require('mongoose');

// Obtener un producto por ID
const getProductById = async (req, res) => {
    try {
      const { id } = req.params; // ID del producto desde los parámetros de la URL
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de producto inválido' });
      }
  
      const product = await Product.findById(id);
  
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      res.status(200).json({ product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el producto', error });
    }
  };




  
// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, quantity, sizes } = req.body;
    const secondaryImagesToRemove = req.body.secondaryImagesToRemove 
      ? JSON.parse(req.body.secondaryImagesToRemove) 
      : [];

    const mainImage = req.files?.image ? req.files.image[0] : null;
    const secondaryImages = req.files?.secondaryImages || [];

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    let uploadedMainImageUrl = existingProduct.images.main;
    if (mainImage) {
      const uploadedMainImage = await uploadFromBuffer(mainImage.buffer);
      uploadedMainImageUrl = uploadedMainImage.secure_url;
    }

    // Mantener las imágenes actuales menos las que se quieren eliminar
    let uploadedSecondaryImagesUrls = existingProduct.images.secondary.filter(
      url => !secondaryImagesToRemove.includes(url)
    );

    // Agregar nuevas imágenes
    for (const file of secondaryImages) {
      const uploadedImage = await uploadFromBuffer(file.buffer);
      uploadedSecondaryImagesUrls.push(uploadedImage.secure_url);
    }

    const updateData = {
      name,
      description,
      price,
      category,
      quantity,
      sizes: ['tenis', 'poloche', 'pantalones'].includes(category) && Array.isArray(sizes) ? sizes : [],
      images: {
        main: uploadedMainImageUrl,
        secondary: uploadedSecondaryImagesUrls,
      },
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: 'Producto actualizado correctamente', product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};





// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
};













// Mejor filtro dinámico para productos
const filterProducts = async (req, res, next) => {
    try {
        const { categoria, minPrecio, maxPrecio, nombre } = req.query;

        const filter = {};

        // Filtro por nombre (regex, insensible a mayúsculas/minúsculas)
        if (nombre) {
            filter.name = { $regex: nombre, $options: 'i' };
        }

        // Filtro por categoría exacta
        if (categoria && categoria.toLowerCase() !== 'todos') {
            filter.category = categoria;
        }

        // Filtro por rango de precio
        if (minPrecio || maxPrecio) {
            filter.price = {};
            if (minPrecio) filter.price.$gte = parseFloat(minPrecio);
            if (maxPrecio) filter.price.$lte = parseFloat(maxPrecio);
        }

        // Buscar productos con el filtro construido dinámicamente
        const products = await Product.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            products,
            count: products.length
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadFromBuffer,
  filterProducts,
};
