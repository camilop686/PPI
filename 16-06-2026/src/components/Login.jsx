function Login() {
  return (
    <div className="container mt-4">
      <h2>Iniciar Sesión</h2>

      <input className="form-control mb-2" placeholder="Correo" />
      <input className="form-control mb-2" type="password" placeholder="Contraseña" />
      <button className="btn btn-primary">Ingresar</button>
    </div>
  );
}

export default Login;