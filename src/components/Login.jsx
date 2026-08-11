function Login() {
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

        <form>
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
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