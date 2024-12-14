import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const FormularioContacto = ({ usuarioId }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [contacto, setContacto] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    empresa: '',
    domicilio: '',
    esPublico: false,
    contrasenia: '', 
    propietario: usuarioId,
  });

  useEffect(() => {
    if (location.state?.contactoSeleccionado) {
      setContacto(location.state.contactoSeleccionado);
    } else if (id) {
      const fetchContacto = async () => {
        try {
          const response = await fetch(`http://localhost:3000/contactos/${id}`);
          if (response.ok) {
            const contactoData = await response.json();
            setContacto(contactoData);
          } else {
            console.error('Error al cargar contacto');
          }
        } catch (error) {
          console.error('Error de red:', error);
        }
      };
      fetchContacto();
    }
  }, [id, location.state]);

  const manejarCambio = (e) => {
    setContacto({ ...contacto, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const metodo = contacto._id ? 'PUT' : 'POST';
      const url = contacto._id
        ? `http://localhost:3000/contactos/${contacto._id}`
        : 'http://localhost:3000/contactos';

      const response = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contacto),
      });

      if (response.ok) {
        alert('Contacto guardado exitosamente');
        navigate('/home');
      } else {
        alert('Error al guardar el contacto');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>{id ? 'Editar Contacto' : 'Agregar Nuevo Contacto'}</h3>
      <form onSubmit={manejarEnvio}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={contacto.nombre}
            onChange={manejarCambio}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input
            type="text"
            className="form-control"
            name="apellido"
            value={contacto.apellido}
            onChange={manejarCambio}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={contacto.email}
            onChange={manejarCambio}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            className="form-control"
            name="telefono"
            value={contacto.telefono}
            onChange={manejarCambio}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Empresa</label>
          <input
            type="text"
            className="form-control"
            name="empresa"
            value={contacto.empresa}
            onChange={manejarCambio}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Domicilio</label>
          <input
            type="text"
            className="form-control"
            name="domicilio"
            value={contacto.domicilio}
            onChange={manejarCambio}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            name="contrasenia"
            value={contacto.contrasenia}
            onChange={manejarCambio}
            required
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="esPublico"
            checked={contacto.esPublico}
            onChange={(e) => setContacto({ ...contacto, esPublico: e.target.checked })}
          />
          <label className="form-check-label">Es Público</label>
        </div>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
};

export default FormularioContacto;
