import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../UsuarioContext';

const EditarUsuario = () => {
  const [usuario, setUsuarioLocal] = useState(''); 
  const [correo, setCorreo] = useState(''); 
  const navigate = useNavigate();
  const { setUsuario } = useUsuario(); 
  const userId = localStorage.getItem('id'); 

  useEffect(() => {
    if (!userId) {
      navigate('/ingresar');
      return;
    }

    const storedUsuario = localStorage.getItem('usuario');
    const storedCorreo = localStorage.getItem('correo');
    if (storedUsuario && storedCorreo) {
      setUsuarioLocal(storedUsuario);
      setCorreo(storedCorreo);
    }
  }, [navigate, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      navigate('/ingresar');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/usuarios/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: usuario, correo }),
      });

      if (response.ok) {
        
        localStorage.setItem('usuario', usuario);
        localStorage.setItem('correo', correo);

       
        setUsuario({ id: userId, nombre: usuario, correo });

        alert('Datos actualizados correctamente.');
        navigate('/home');
      } else {
        alert('No se pudieron actualizar los datos.');
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      alert('Error de red al actualizar los datos.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="usuario" className="form-label">Nombre</label>
          <input
            id="usuario"
            type="text"
            className="form-control"
            value={usuario}
            onChange={(e) => setUsuarioLocal(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="correo" className="form-label">Correo</label>
          <input
            id="correo"
            type="email"
            className="form-control"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarUsuario;
