// Menú administrativo heredado; el panel conectado actual vive en App.jsx.
function MenuAdmin({ onCerrarSesion }) {
  return (
    <div className="admin-container">

      <header className="admin-header">
        <img
          src="/logo.png"
          alt="Logo del proyecto"
          className="admin-logo"
        />

        <div>
          <h1>Métodos fiables para la prevención de virus</h1>
          <p>Panel de administración</p>
        </div>
      </header>

      <main className="admin-content">

        <div className="admin-titulo">
          <h2>Panel de control 🛡️</h2>

          <p>
            Desde aquí puedes administrar los diferentes recursos
            de la plataforma.
          </p>
        </div>

        <div className="admin-opciones">

          <button className="admin-opcion">
            <span>👥</span>

            <div>
              <strong>Gestionar usuarios</strong>
              <small>
                Administrar las cuentas registradas
              </small>
            </div>
          </button>

          <button className="admin-opcion">
            <span>🛡️</span>

            <div>
              <strong>Métodos de prevención</strong>
              <small>
                Crear y administrar métodos fiables
              </small>
            </div>
          </button>

          <button className="admin-opcion">
            <span>🦠</span>

            <div>
              <strong>Información sobre virus</strong>
              <small>
                Administrar información de prevención
              </small>
            </div>
          </button>

          <button className="admin-opcion">
            <span>📊</span>

            <div>
              <strong>Reportes y estadísticas</strong>
              <small>
                Consultar información del sistema
              </small>
            </div>
          </button>

        </div>

        <div className="admin-construccion">
          🚧 Las funciones administrativas están en construcción.
        </div>

        <button className="admin-cerrar" onClick={onCerrarSesion}>
  Cerrar sesión
</button>

      </main>

    </div>
  );
}

export default MenuAdmin;