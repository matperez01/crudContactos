import React from 'react';
import { useNavigate } from 'react-router-dom';

const EditarContacto = ({ contacto, setContacto, usuarioId, id }) => {
  const navigate = useNavigate();

  const guardarContacto = async (contactoConPropietario) => {
    try {
      if (!usuarioId) {
        alert('Error: Usuario no identificado. No se puede guardar el contacto.');
        return;
      }

      const metodo = contactoConPropietario._id ? 'PUT' : 'POST';
      const url = contactoConPropietario._id
        ? `http://localhost:3000/contactos/${contactoConPropietario._id}`
        : 'http://localhost:3000/contactos';

      const response = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactoConPropietario),
      });

      if (response.ok) {
        alert('Contacto guardado exitosamente');
        navigate('/home');
      } else {
        const errorData = await response.json();
        console.error('Error al guardar:', errorData);
        alert(`Error al guardar el contacto: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al guardar contacto:', error);
      alert('Error al guardar el contacto');
    }
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    guardarContacto({ ...contacto, propietario: usuarioId, _id: id });
  };

  return (
    <button type="submit" className="btn btn-primary" onClick={manejarEnvio}>
      Guardar
    </button>
  );
};

export default EditarContacto;