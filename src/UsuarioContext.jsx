import React, { createContext, useContext, useState } from 'react';


const UsuarioContext = createContext();

export const useUsuario = () => useContext(UsuarioContext);


export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const storedUser = localStorage.getItem('usuario');
    const storedCorreo = localStorage.getItem('correo');
    const storedId = localStorage.getItem('id');
    return storedUser && storedCorreo && storedId
      ? { id: storedId, nombre: storedUser, correo: storedCorreo }
      : null;
  });

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};