import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [usuario, setUsuario] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const [misContactos, setMisContactos] = useState([]);
  const [contactosPublicos, setContactosPublicos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioLogueado = localStorage.getItem('usuario');
    const id = localStorage.getItem('id');

    if (!usuarioLogueado || !id) {
      navigate('/ingresar');
      return;
    }

    setUsuario(usuarioLogueado);
    setUsuarioId(id);

    const fetchMisContactos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/contactos-usuario/${id}`);
        if (response.ok) {
          const contactosData = await response.json();
          setMisContactos(contactosData);
        } else {
          console.error('Error al obtener contactos');
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    };

    const fetchContactosPublicos = async () => {
      try {
        const response = await fetch('http://localhost:3000/contactos-publicos');
        if (response.ok) {
          const contactosPublicosData = await response.json();
          setContactosPublicos(contactosPublicosData);
        } else {
          console.error('Error al obtener contactos públicos');
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    };

    fetchMisContactos();
    fetchContactosPublicos();
  }, [navigate]);

  const handleEliminarContacto = async (contactoId) => {
    try {
      const response = await fetch(`http://localhost:3000/contactos/${contactoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMisContactos(misContactos.filter(contacto => contacto._id !== contactoId));
        alert('Contacto eliminado exitosamente');
      } else {
        alert('Error al eliminar contacto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de red al eliminar contacto');
    }
  };

  const handleEditarContacto = (contacto) => {
    navigate(`/editar-contacto/${contacto._id}`, { state: { contactoSeleccionado: contacto } });
  };

  const renderContactCards = (contactos, titulo, esEditable = false) => (
    <div className="container d-flex flex-column align-items-center mt-5">
      <h2 className="text-center mb-4">{titulo}</h2>
      {contactos.length > 0 ? (
        contactos.map(contacto => (
          <div className="card mb-4 w-75" key={contacto._id}>
            <div className="card-body">
              <h5 className="card-title text-center">
                {contacto.nombre} {contacto.apellido}
              </h5>
              <p className="card-text"><strong>Empresa:</strong> {contacto.empresa}</p>
              <p className="card-text"><strong>Domicilio:</strong> {contacto.domicilio}</p>
              <p className="card-text"><strong>Telefono:</strong> {contacto.telefono}</p>
              <p className="card-text"><strong>Email:</strong> {contacto.email}</p>
              
              {esEditable && (
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleEditarContacto(contacto)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleEliminarContacto(contacto._id)}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">No hay contactos registrados</p>
      )}
    </div>
  );

  const misContactosPublicos = misContactos.filter(contacto => contacto.esPublico);
  const misContactosPrivados = misContactos.filter(contacto => !contacto.esPublico);

  // Excluir mis contactos públicos de la lista de contactos públicos generales
  const contactosPublicosFiltrados = contactosPublicos.filter(
    contactoPublico => !misContactosPublicos.some(
      miContacto => miContacto._id === contactoPublico._id
    )
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center">Bienvenido, {usuario}</h2>
      <div className="text-center mb-4">
        <button
          className="btn btn-primary"
          onClick={() => navigate('/agregar-contacto')}
        >
          Agregar Nuevo Contacto
        </button>
      </div>
      
      {/* Contactos públicos de otros usuarios */}
      {renderContactCards(contactosPublicosFiltrados, 'Contactos Públicos')}
      
      {/* Mis contactos públicos y privados */}
      {renderContactCards(misContactosPublicos, 'Mis Contactos Públicos', true)}
      {renderContactCards(misContactosPrivados, 'Mis Contactos Privados', true)}
    </div>
  );
};

export default Home;