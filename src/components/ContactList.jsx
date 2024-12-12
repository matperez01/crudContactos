import React, { useState, useEffect } from 'react'; // Importa React y hooks useState y useEffect.
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap.

const ContactList = () => {
  const [contacts, setContacts] = useState([]); // Estado para almacenar los contactos.

  useEffect(() => { // Hook que se ejecuta cuando el componente se monta.
    const fetchContacts = async () => { // Función asíncrona para obtener los contactos.
      const contactsData = [ // Datos de contactos simulados.
        { id: 1, apellido: 'Velazquez', nombre: 'Tobias', empresa: 'Empresa A', domicilio: 'Balcarce 2435', telefonos: '3813491819', email: 'tobias@gmail.com', propietario: '-', esPublico: true, esVisible: true, contraseña: '-' },
        { id: 2, apellido: 'Teseyra', nombre: 'Juan', empresa: 'Empresa B', domicilio: 'Santiago del Estero 51', telefonos: '3876450404', email: 'juan@gmail.com', propietario: '-', esPublico: true, esVisible: true, contraseña: '-' },
        { id: 3, apellido: 'Daud', nombre: 'Baltasar', empresa: 'Empresa C', domicilio: 'Mendoza 421', telefonos: '3878572404', email: 'baltasar@gmail.com', propietario: '-', esPublico: true, esVisible: true, contraseña: '-' }
      ];
      const filteredContacts = contactsData.filter(contact => contact.esPublico && contact.esVisible); // Filtra los contactos que son públicos y visibles.
      filteredContacts.sort((a, b) => (a.apellido.localeCompare(b.apellido)) || a.nombre.localeCompare(b.nombre)); // Ordena los contactos por apellido y luego por nombre.
      setContacts(filteredContacts); // Actualiza el estado con los contactos filtrados y ordenados.
    };

    fetchContacts(); // Llama a la función para obtener los contactos.
  }, []); // El array vacío indica que useEffect se ejecutará solo una vez después del primer renderizado.

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100"> {/* Contenedor principal centrado */}
      <div className="w-100">
        <h2 className="text-center mb-4 mt-5">Contactos Públicos</h2> {/* Título de la sección */}
        <div className="d-flex flex-column align-items-center"> {/* Contenedor de tarjetas */}
          {contacts.map(contact => ( // Mapea sobre los contactos para renderizar cada uno.
            <div className="card mb-4 w-75" key={contact.id}> {/* Tarjeta de Bootstrap para cada contacto */}
              <div className="card-body">
                <h5 className="card-title text-center">{contact.apellido} {contact.nombre}</h5> {/* Nombre completo del contacto */}
                <p className="card-text"><strong>Empresa:</strong> {contact.empresa}</p> {/* Empresa del contacto */}
                <p className="card-text"><strong>Domicilio:</strong> {contact.domicilio}</p> {/* Domicilio del contacto */}
                <p className="card-text"><strong>Teléfonos:</strong> {contact.telefonos}</p> {/* Teléfonos del contacto */}
                <p className="card-text"><strong>Email:</strong> {contact.email}</p> {/* Email del contacto */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactList; // Exporta el componente ContactList.
