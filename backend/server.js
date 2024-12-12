const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://perezenzo222:Piloloco12.@peyectocontactos.h1tig.mongodb.net/proyectoFinal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error de conexión:', error));

// Registro de usuario
app.post('/register', async (req, res) => {
  console.log('Datos recibidos en /register:', req.body);

  const { usuario, correo, contrasenia } = req.body;

  // Validate input fields
  if (!usuario || !correo || !contrasenia) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Validate email format
    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ message: 'Formato de correo inválido' });
    }

    // Validate password length
    if (contrasenia.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const usuarioExistente = await User.findOne({
      $or: [{ usuario }, { correo }]
    });

    if (usuarioExistente) {
      console.log('Usuario o correo ya existe:', usuarioExistente);
      return res.status(400).json({
        message: 'Usuario o correo ya registrado',
        details: usuarioExistente.usuario === usuario ? 'Nombre de usuario ya existe' : 'Correo ya está registrado'
      });
    }

    const nuevoUsuario = new User({
      usuario,
      correo,
      contrasenia, // Aquí está bien, no se menciona "apellido"
    });
  
    await nuevoUsuario.save();

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario._id,
        usuario: nuevoUsuario.usuario,
        correo: nuevoUsuario.correo
      }
    });
  } catch (error) {
    console.error('Error detallado al registrar usuario:', error);

    // Handle specific Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Error de validación',
        details: messages
      });
    }

    // Generic error handling
    res.status(500).json({
      message: 'Error al registrar usuario',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// Editar usuario
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo } = req.body;

    if (!nombre || !correo) {
      return res.status(400).json({ message: 'El nombre y el correo son obligatorios.' });
    }

    const usuarioActualizado = await User.findByIdAndUpdate(
      id,
      { usuario: nombre, correo },
      { new: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({ message: 'Usuario actualizado correctamente.', usuario: usuarioActualizado });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario.', error: error.message });
  }
});


// Crear contacto
app.post('/contactos', async (req, res) => {
  try {
    const { propietario, nombre, apellido, email, telefono, empresa, domicilio, esPublico, contrasenia } = req.body;

    if (!propietario) {
      return res.status(400).json({ message: 'Propietario es obligatorio' });
    }

    const usuario = await User.findById(propietario);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const nuevoContacto = {
      nombre,
      apellido,
      email,
      telefono,
      empresa,
      domicilio,
      esPublico,
      contrasenia,
    };

    usuario.contactos.push(nuevoContacto);
    await usuario.save();

    res.status(201).json({ message: 'Contacto agregado exitosamente', contacto: nuevoContacto });
  } catch (error) {
    console.error('Error al agregar contacto:', error);
    res.status(500).json({ message: 'Error al agregar contacto', error: error.message });
  }
});

// Inicio de sesión
app.post('/login', async (req, res) => {
  try {
    const { correo, contrasenia } = req.body;

    

    if (!correo || !contrasenia) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    
    if (correo === 'admin' && contrasenia === 'admin') {
      return res.json({
        usuario: {
          id: 'admin',
          nombre: 'Administrador',
          correo: 'admin',
          esAdmin: true
        }
      });
    }


    const usuario = await User.findOne({ correo });
    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const contraseñaValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!contraseñaValida) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.json({
      usuario: {
        id: usuario._id,
        nombre: usuario.usuario,
        correo: usuario.correo,
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
});

// Obtener contactos
app.get('/contactos-usuario/:userId', async (req, res) => {
  try {
    const usuario = await User.findById(req.params.userId).select('contactos');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario.contactos);
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    res.status(500).json({ message: 'Error al obtener contactos', error: error.message });
  }
});



// Editar contacto
app.put('/contactos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { propietario, ...datosActualizados } = req.body;

    const usuario = await User.findOne({ 'contactos._id': id });
    if (!usuario) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    const contacto = usuario.contactos.id(id);
    if (!contacto) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    Object.assign(contacto, datosActualizados);
    await usuario.save();

    res.json({ message: 'Contacto actualizado exitosamente', contacto });
  } catch (error) {
    console.error('Error al actualizar contacto:', error);
    res.status(500).json({ message: 'Error al actualizar contacto', error: error.message });
  }
});

// Eliminar contacto
app.delete('/contactos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Intentando eliminar contacto con id: ${id}`);

    // Buscar al usuario que contiene el contacto
    const usuario = await User.findOne({ 'contactos._id': id });
    if (!usuario) {
      console.log('Usuario no encontrado para el contacto con id:', id);
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    console.log('Usuario encontrado:', usuario);

    // Filtrar el contacto del array de contactos
    usuario.contactos = usuario.contactos.filter(contacto => contacto._id.toString() !== id);

    // Guardar los cambios
    await usuario.save();

    console.log('Contacto eliminado exitosamente');
    res.json({ message: 'Contacto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar contacto:', error);
    res.status(500).json({ message: 'Error al eliminar contacto', error: error.message });
  }
});

// Obtener todos los contactos para el admin
app.get('/todos-los-contactos', async (req, res) => {
  try {
    const usuarios = await User.find().select('contactos');
    console.log('Usuarios encontrados:', usuarios); // Añade este log
    const todosLosContactos = usuarios.reduce((acc, usuario) => {
      console.log('Contactos del usuario:', usuario.contactos); // Añade este log
      return acc.concat(usuario.contactos);
    }, []);
    console.log('Todos los contactos concatenados:', todosLosContactos); // Añade este log
    res.json(todosLosContactos);
  } catch (error) {
    console.error('Error al obtener todos los contactos:', error);
    res.status(500).json({ message: 'Error al obtener todos los contactos', error: error.message });
  }
});

app.patch('/contactos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { esPublico } = req.body;

    if (esPublico === undefined) {
      return res.status(400).json({ message: 'Debe proporcionar el estado de esPublico' });
    }

    const usuario = await User.findOne({ 'contactos._id': id });
    if (!usuario) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    const contacto = usuario.contactos.id(id);
    if (!contacto) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    contacto.esPublico = esPublico;
    await usuario.save();

    res.json({ message: 'Visibilidad del contacto actualizada', contacto });
  } catch (error) {
    console.error('Error al cambiar la visibilidad del contacto:', error);
    res.status(500).json({ message: 'Error al cambiar la visibilidad del contacto', error: error.message });
  }
});

app.get('/contactos-publicos', async (req, res) => {
  try {
    const usuarios = await User.find();
    const contactosPublicos = usuarios.reduce((acc, usuario) => {
      // Filtrar solo contactos públicos
      const publicosDeOtrosUsuarios = usuario.contactos.filter(contacto => contacto.esPublico);
      return acc.concat(publicosDeOtrosUsuarios);
    }, []);

    res.json(contactosPublicos);
  } catch (error) {
    console.error('Error al obtener contactos públicos:', error);
    res.status(500).json({ message: 'Error al obtener contactos públicos', error: error.message });
  }
});




app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});