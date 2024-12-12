import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsuario } from '../UsuarioContext';

const BarraNavegacion = () => {
  const { usuario, setUsuario } = useUsuario();
  const navigate = useNavigate();

  useEffect(() => {
    // Este efecto se ejecutará cuando 'usuario' cambie
  }, [usuario]);

  const alCerrarSesion = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('correo');
    localStorage.removeItem('id');
    setUsuario(null);
    navigate('/ingresar');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">Gestor de Contactos</Link>
        <div className="d-flex">
          {usuario ? (
            <>
              <span className="navbar-text me-3">
                <Link to={usuario.id === 'admin' ? '/admin-panel' : '/perfil'} className="text-decoration-none">
                  {usuario.nombre} 
                </Link>
              </span>
              <button className="btn btn-outline-danger" onClick={alCerrarSesion}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/registro" className="btn btn-outline-primary me-2">Registrar</Link>
              <Link to="/ingresar" className="btn btn-outline-success">Ingresar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BarraNavegacion;