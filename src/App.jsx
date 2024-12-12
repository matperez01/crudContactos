import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContactList from './components/ContactList';
import BarraNavegacion from './components/BarraNavegacion';
import FormularioRegistro from './components/FormularioRegistro';
import FormularioInicioSesion from './components/FormularioInicioSesion';
import FormularioContacto from './components/FormularioContacto';
import Home from './components/Home';  // Import the new Home component
import EditarUsuario from './components/EditarUsuario';
import AdminPanel from './components/AdminPanel';

import { UsuarioProvider } from '../src/UsuarioContext';



const App = () => {
  const [usuario, setUsuario] = useState(() => {
    // Initialize user state from localStorage
    const storedUser = localStorage.getItem('usuario');
    return storedUser ? { nombre: storedUser } : null;
  });

  // Función para manejar el registro de un usuario
  const manejarRegistro = (datos) => {
    console.log('Datos registrados:', datos);
    setUsuario({ usuario: datos.usuario });
  };

  // Función para manejar el inicio de sesión
  const manejarInicioSesion = (datos) => {
    console.log('Inicio de sesión:', datos);
    // Store user info in localStorage
    localStorage.setItem('usuario', datos.usuario.nombre);
    localStorage.setItem('correo', datos.usuario.correo);
    localStorage.setItem('id', datos.usuario.id);
    
    setUsuario({ nombre: datos.usuario.nombre });
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    // Clear localStorage
    localStorage.removeItem('usuario');
    localStorage.removeItem('correo');
    localStorage.removeItem('id');
    
    setUsuario(null);
  };

  

  return (
    <UsuarioProvider>
    <Router>
      {/* Barra de navegación */}
      <BarraNavegacion usuario={usuario} alCerrarSesion={cerrarSesion} />

      {/* Definición de rutas */}
      <Routes>
        {/* Ruta principal muestra ContactList */}
        <Route path="/" element={<ContactList />} />
        <Route path="/home" element={<Home />} />  {/* Add Home route */}
        <Route path="/perfil" element={<EditarUsuario />} />
        <Route path="/admin-panel" element={<AdminPanel />} />

        {/* Rutas adicionales */}
        <Route path="/registro" element={<FormularioRegistro alRegistrar={manejarRegistro} />} />
        <Route path="/ingresar" element={<FormularioInicioSesion alIngresar={manejarInicioSesion} />} />
        <Route 
            path="/agregar-contacto" 
            element={<FormularioContacto usuarioId={localStorage.getItem('id')} />} 
          />
        <Route
          path="/editar-contacto/:id"
          element={
            <FormularioContacto usuarioId={localStorage.getItem('id')} />
          }
        />

        {/* Ruta comodín para redirigir al componente inicial en caso de rutas no definidas */}
        <Route path="*" element={<ContactList />} />
      </Routes>
    </Router>
    </UsuarioProvider>
  );
};

export default App;