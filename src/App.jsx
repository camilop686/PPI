import { useState } from 'react';
import './App.css';
import MetodosPrevencion from './components/MetodosPrevencion';

import Login from './components/Login';
import MenuUsuario from './components/MenuUsuario';
import MenuAdmin from './components/MenuAdmin';

function App() {
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [pantalla, setPantalla] = useState('menu');

  function manejarLogin(tipo) {
    setTipoUsuario(tipo);
  }

  function cerrarSesion() {
    setTipoUsuario(null);
    setPantalla('menu');
  }

  if (tipoUsuario === 'usuario') {
  if (pantalla === 'metodos') {
    return (
      <MetodosPrevencion
        onVolver={() => setPantalla('menu')}
      />
    );
  }

  return (
    <MenuUsuario
      onCerrarSesion={cerrarSesion}
      onMetodos={() => setPantalla('metodos')}
    />
  );
}

  if (tipoUsuario === 'admin') {
    return <MenuAdmin onCerrarSesion={cerrarSesion} />;
  }

  return <Login onLogin={manejarLogin} />;
}

export default App;