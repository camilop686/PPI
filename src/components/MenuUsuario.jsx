// Menú de usuario heredado; se conserva para compatibilidad con la versión anterior.
function MenuUsuario({ onCerrarSesion, onMetodos }) {
    return (
        <div className="menu-container">

            <header className="menu-header">
                <img
                    src="/logo.png"
                    alt="Logo del proyecto"
                    className="menu-logo"
                />

                <div>
                    <h1>Métodos fiables para la prevención de virus</h1>
                    <p>Panel de usuario</p>
                </div>
            </header>

            <main className="menu-content">

                <h2>Bienvenido 👋</h2>

                <p className="descripcion-menu">
                    Encuentra información y métodos fiables para prevenir
                    diferentes tipos de virus y mantenerte protegido.
                </p>

                <div className="menu-opciones">

                    <button className="menu-opcion">
                        <span>🏠</span>
                        <div>
                            <strong>Inicio</strong>
                            <small>Página principal</small>
                        </div>
                    </button>

                    <button className="menu-opcion" onClick={onMetodos}>
                        <span>🛡️</span>

                        <div>
                            <strong>Métodos de prevención</strong>
                            <small>
                                Consulta métodos fiables para protegerte
                            </small>
                        </div>
                    </button>

                    <button className="menu-opcion">
                        <span>🦠</span>
                        <div>
                            <strong>Información sobre virus</strong>
                            <small>Consulta información sobre diferentes virus</small>
                        </div>
                    </button>

                    <button className="menu-opcion">
                        <span>💬</span>
                        <div>
                            <strong>Comentarios y recomendaciones</strong>
                            <small>
                                Consulta y comparte métodos para prevenir virus informáticos
                            </small>
                        </div>
                    </button>

                    <button className="menu-opcion">
                        <span>👤</span>
                        <div>
                            <strong>Mi perfil</strong>
                            <small>Consulta tu información personal</small>
                        </div>
                    </button>

                </div>

                <div className="construccion">
                    🚧 Algunas funciones están actualmente en construcción.
                </div>

                <button className="cerrar-sesion" onClick={onCerrarSesion}>
                    Cerrar sesión
                </button>

            </main>

        </div>
    );
}

export default MenuUsuario;