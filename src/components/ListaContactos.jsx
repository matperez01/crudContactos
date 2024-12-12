import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ListaContactos = ({ contactos, eliminarContacto, editarContacto }) => {
  return (
    <div className="container mt-4">
      <h3>Lista de Contactos</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contactos.map((contacto, index) => (
            <tr key={index}>
              <td>{contacto.nombre}</td>
              <td>{contacto.email}</td>
              <td>
                <button 
                  className="btn btn-primary"
                  onClick={() => editarContacto(contacto)}>Editar</button>
                <button 
                  className="btn btn-danger ms-2"
                  onClick={() => eliminarContacto(contacto)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/agregar-contacto" className="btn btn-success mt-3">Agregar Contacto</Link>
    </div>
  );
};

export default ListaContactos;
