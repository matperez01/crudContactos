// EliminarContacto.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EliminarContacto = ({ id }) => {
  const navigate = useNavigate();

  const eliminarContacto = async () => {
    try {
      const response = await fetch(`http://localhost:3000/contactos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Contacto eliminado exitosamente');
        navigate('/home');
      } else {
        const errorData = await response.json();
        console.error('Error al eliminar:', errorData);
        alert(`Error al eliminar el contacto: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
      alert('Error al eliminar el contacto');
    }
  };

  return (
    <button
      type="button"
      className="btn btn-danger ms-2"
      onClick={eliminarContacto}
    >
      Eliminar
    </button>
  );
};

export default EliminarContacto;
