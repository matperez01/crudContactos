import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
const ContactList = () => {
  const [contacts, setContacts] = useState([]); 

  useEffect(() => { 
    const fetchContacts = async () => { 
      const contactsData = [ 
        { id: 1, apellido: 'Velazquez', nombre: 'Tobias', empresa: 'Empresa A', domicilio: 'Balcarce 2435', telefonos: '3813491819', email: 'tobias@gmail.com', propietario: '-', esPublico: true, esVisible: true, contraseña: '-' },
        { id: 2, apellido: 'Teseyra', nombre: 'Juan', empresa: 'Empresa B', domicilio: 'Santiago del Estero 51', telefonos: '3876450404', email: 'juan@gmail.com', propietario: '-', esPublico: true, esVisible: true, contraseña: '-' },
        { id: 3, apellido: 'Daud', nombre: 'Baltasar', empresa: 'Empresa C', domicilio: 'Mendoza 421', telefonos: '3878572404', email: 'baltasar@gmail.com', propietario: '-', esPublico: true, esVisible: true, contraseña: '-' }
      ];
      const filteredContacts = contactsData.filter(contact => contact.esPublico && contact.esVisible); 
      filteredContacts.sort((a, b) => (a.apellido.localeCompare(b.apellido)) || a.nombre.localeCompare(b.nombre)); 
      setContacts(filteredContacts); 
    };

    fetchContacts(); 
  }, []); 

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100"> 
      <div className="w-100">
        <h2 className="text-center mb-4 mt-5">Contactos Públicos</h2> 
        <div className="d-flex flex-column align-items-center"> 
          {contacts.map(contact => ( 
            <div className="card mb-4 w-75" key={contact.id}> 
              <div className="card-body">
                <h5 className="card-title text-center">{contact.apellido} {contact.nombre}</h5>
                <p className="card-text"><strong>Empresa:</strong> {contact.empresa}</p> 
                <p className="card-text"><strong>Domicilio:</strong> {contact.domicilio}</p> 
                <p className="card-text"><strong>Teléfonos:</strong> {contact.telefonos}</p> 
                <p className="card-text"><strong>Email:</strong> {contact.email}</p> 
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactList; 
