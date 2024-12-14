import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormularioRegistro = ({ alRegistrar }) => {
  const navigate = useNavigate();
  const [datosFormulario, setDatosFormulario] = useState({
    usuario: '', // Cambiado de "nombre" a "usuario"
    correo: '',  // Cambiado de "email" a "correo"
    contrasenia: '', // Cambiado de "contraseña" a "contrasenia"
  });

  const manejarCambio = (e) => {
    setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    try {
      const respuesta = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosFormulario),
      });
  
      const datos = await respuesta.json();
  
      if (!respuesta.ok) {
        // More detailed error logging
        console.error('Error en el registro:', datos);
        
        // Display a more specific error message
        const errorMessage = datos.details || datos.message || 'Error al registrar';
        alert(errorMessage);
        
        throw new Error(errorMessage);
      } else {
        console.log('Usuario registrado con éxito:', datos);
        alert('Usuario registrado exitosamente');
        // Optionally, redirect or update state
        navigate('/');
      }
    } catch (error) {
      console.error('Error completo:', error);
      alert(error.message || 'Error al conectar con el servidor');
    }
  };
  

  return (
    <div className="container mt-4">
      <h3>Registrar Usuario</h3>
      <form onSubmit={manejarEnvio}>
      <div className="mb-3">
        <label className="form-label">Usuario</label>
        <input
          type="text"
          name="usuario" // Asegúrate de que este sea "usuario"
          className="form-control"
          value={datosFormulario.usuario}
          onChange={manejarCambio}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Correo</label>
        <input
          type="email"
          name="correo" // Asegúrate de que este sea "correo"
          className="form-control"
          value={datosFormulario.correo}
          onChange={manejarCambio}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input
          type="password"
          name="contrasenia" // Asegúrate de que este sea "contrasenia"
          className="form-control"
          value={datosFormulario.contrasenia}
          onChange={manejarCambio}
          required
        />
      </div>
        <button type="submit" className="btn btn-primary">Registrar</button>
      </form>
    </div>
  );
};

export default FormularioRegistro;
