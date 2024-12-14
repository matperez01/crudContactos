import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContactList from './components/ContactList';
import BarraNavegacion from './components/BarraNavegacion';
import FormularioRegistro from './components/FormularioRegistro';
import FormularioInicioSesion from './components/FormularioInicioSesion';
import FormularioContacto from './components/FormularioContacto';
import Home from './components/Home';  
import EditarUsuario from './components/EditarUsuario';
import AdminPanel from './components/AdminPanel';

import { UsuarioProvider } from '../src/UsuarioContext';



const App = () => {
  const [usuario, setUsuario] = useState(() => {
    
    const storedUser = localStorage.getItem('usuario');
    return storedUser ? { nombre: storedUser } : null;
  });

 
  const manejarRegistro = (datos) => {
    console.log('Datos registrados:', datos);
    setUsuario({ usuario: datos.usuario });
  };


  const manejarInicioSesion = (datos) => {
    console.log('Inicio de sesión:', datos);
  
    localStorage.setItem('usuario', datos.usuario.nombre);
    localStorage.setItem('correo', datos.usuario.correo);
    localStorage.setItem('id', datos.usuario.id);
    
    setUsuario({ nombre: datos.usuario.nombre });
  };


  const cerrarSesion = () => {

    localStorage.removeItem('usuario');
    localStorage.removeItem('correo');
    localStorage.removeItem('id');
    
    setUsuario(null);
  };

  

  return (
    <UsuarioProvider>
    <Router>

      <BarraNavegacion usuario={usuario} alCerrarSesion={cerrarSesion} />


      <Routes>
   
        <Route path="/" element={<ContactList />} />
        <Route path="/home" element={<Home />} />  
        <Route path="/perfil" element={<EditarUsuario />} />
        <Route path="/admin-panel" element={<AdminPanel />} />

   
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

     
        <Route path="*" element={<ContactList />} />
      </Routes>
    </Router>
    </UsuarioProvider>
  );
};

export default App;