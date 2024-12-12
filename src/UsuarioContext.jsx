import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const UsuarioContext = createContext();

// Hook para usar el contexto
export const useUsuario = () => useContext(UsuarioContext);

// Proveedor de contexto
export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    // Inicializar usuario desde localStorage
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