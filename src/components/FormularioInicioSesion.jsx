import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../UsuarioContext';

const FormularioInicioSesion = () => {
  const navigate = useNavigate();
  const [datosFormulario, setDatosFormulario] = useState({
    correo: '',
    contrasenia: '',
  });
  const { setUsuario } = useUsuario();

  const manejarCambio = (e) => {
    setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    if (datosFormulario.correo === 'admin' && datosFormulario.contrasenia === 'admin') {
      // Aquí irías al componente especial para el administrador
      setUsuario({ id: 'admin', nombre: 'Administrador', correo: 'admin' }); // Establece 'Administrador' como nombre
      navigate('/admin-panel');
    } else {
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosFormulario),
        });
  
        if (response.ok) {
          const data = await response.json();
          
          localStorage.setItem('usuario', data.usuario.nombre);
          localStorage.setItem('correo', data.usuario.correo);
          localStorage.setItem('id', data.usuario.id);

          setUsuario({ nombre: data.usuario.nombre, correo: data.usuario.correo, id: data.usuario.id });

          navigate('/home');
        } else {
          const error = await response.json();
          alert(error.message);
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Hubo un problema al conectarse con el servidor');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3>Iniciar Sesión</h3>
      <form onSubmit={manejarEnvio}> 
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input
            type="text"
            name="correo"
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
            name="contrasenia"
            className="form-control"
            value={datosFormulario.contrasenia}
            onChange={manejarCambio}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Ingresar</button>
      </form>
    </div>
  );
};

export default FormularioInicioSesion;