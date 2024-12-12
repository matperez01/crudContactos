import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [usuario, setUsuario] = useState('Administrador');
  const [contactos, setContactos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllContactos = async () => {
      try {
        const response = await fetch('http://localhost:3000/todos-los-contactos');
        if (response.ok) {
          const contactosData = await response.json();
          setContactos(contactosData);
        } else {
          console.error('Error al obtener contactos');
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    };

    fetchAllContactos();
  }, []);

  

 

  const togglePublico = async (contactoId, esPublico) => {
    try {
      const response = await fetch(`http://localhost:3000/contactos/${contactoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ esPublico: !esPublico }),
      });

      if (response.ok) {
        setContactos(contactos.map(c => 
          c._id === contactoId ? { ...c, esPublico: !esPublico } : c
        ));
        alert('Estado de visibilidad actualizado');
      } else {
        alert('Error al actualizar el estado de visibilidad');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de red al actualizar el estado de visibilidad');
    }
  };

  const renderContactCards = (contactos, titulo) => (
    <div className="container d-flex flex-column align-items-center mt-5">
      <h2 className="text-center mb-4">{titulo}</h2>
      {contactos.length > 0 ? (
        contactos.map(contacto => (
          <div className="card mb-4 w-75" key={contacto._id}>
            <div className="card-body">
              <h5 className="card-title text-center">
                {contacto.nombre} {contacto.apellido}
              </h5>
              <p className="card-text"><strong>Empresa:</strong> {contacto.empresa || 'N/A'}</p>
              <p className="card-text"><strong>Domicilio:</strong> {contacto.domicilio || 'N/A'}</p>
              <p className="card-text"><strong>Telefono:</strong> {contacto.telefono || 'N/A'}</p>
              <p className="card-text"><strong>Email:</strong> {contacto.email}</p>
              <p className="card-text"><strong>Visibilidad:</strong> {contacto.esPublico ? 'Público' : 'Privado'}</p>
              <div className="d-flex justify-content-center">
                
                
                <button 
                  className="btn btn-secondary"
                  onClick={() => togglePublico(contacto._id, contacto.esPublico)}
                >
                  {contacto.esPublico ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">No hay contactos registrados</p>
      )}
    </div>
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center">Bienvenido, {usuario}</h2>
      <div className="text-center mb-4">
     
      </div>
      {renderContactCards(contactos, 'Todos los Contactos')}
    </div>
  );
};

export default AdminPanel;