import { useState } from 'react';

function Login({ onLogin }) {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');

  function manejarIngreso(e) {
    e.preventDefault();

    // Usuarios de prueba
    if (correo === 'usuario@gmail.com' && contraseña === '1234') {
      onLogin('usuario');
      return;
    }

    if (correo === 'admin@gmail.com' && contraseña === '1234') {
      onLogin('admin');
      return;
    }

    alert('Correo o contraseña incorrectos');
  }

  return (
    <div className="login">
      <div className="login-card">

        <img
          src="/logo.png"
          alt="Logo del proyecto"
          className="login-logo"
        />

        <h1>Iniciar sesión</h1>

        <p>Ingresa a tu cuenta</p>

        <form onSubmit={manejarIngreso}>

          <label>Correo electrónico</label>

          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <label>Contraseña</label>

          <input
            type="password"
            placeholder="••••••••"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />

          <button type="submit">
            Ingresar
          </button>

        </form>

        <p className="crear-cuenta">
          ¿No tienes una cuenta?

          <button type="button">
            Crear cuenta
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;