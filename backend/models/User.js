const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Importar JWT

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// Encriptar la contraseña antes de guardar al usuario
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();  // Si la contraseña no ha sido modificada, no hacer nada
  const salt = await bcrypt.genSalt(10);  // Generar un "salt" para la encriptación
  this.password = await bcrypt.hash(this.password, salt);  // Encriptar la contraseña
  next();
});

// Método para comparar la contraseña ingresada con la almacenada
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);  // Comparar las contraseñas
};

// Método para generar un JWT
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

module.exports = mongoose.model('User', userSchema);
