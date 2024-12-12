const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const contactoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, match: /.+@.+\..+/ },
  telefono: String,
  empresa: String,
  domicilio: String,
  esPublico: { type: Boolean, default: false },
  propietario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contrasenia: { type: String},
 
});

const userSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true, minlength: 3 },
  correo: { type: String, required: true, unique: true, match: /.+@.+\..+/ },
  contrasenia: { type: String, required: true, minlength: 6 },
  esAdmin: { type: Boolean, default: false },
  contactos: [contactoSchema],
});

// Middleware para hashear contraseña antes de guardar
userSchema.pre('save', async function (next) {
  // Solo hashear la contraseña si ha sido modificada
  if (this.isModified('contrasenia')) {
    try {
      this.contrasenia = await bcrypt.hash(this.contrasenia, 10);
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    return next();
  }
});

// Método para verificar contraseña
userSchema.methods.verificarContrasenia = async function(contrasenia) {
  return await bcrypt.compare(contrasenia, this.contrasenia);
};

module.exports = mongoose.model('User', userSchema);