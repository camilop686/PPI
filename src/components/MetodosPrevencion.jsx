// Catálogo estático heredado; el catálogo activo se obtiene desde Supabase.
function MetodosPrevencion({ onVolver }) {
  return (
    <div className="prevencion-container">

      <header className="prevencion-header">
        <img
          src="/logo.png"
          alt="Logo del proyecto"
          className="prevencion-logo"
        />

        <div>
          <h1>Métodos fiables para la prevención</h1>
          <p>Protección frente a virus informáticos</p>
        </div>
      </header>

      <main className="prevencion-content">

        <div className="prevencion-titulo">
          <h2>Métodos de prevención 🛡️</h2>

          <p>
            Consulta diferentes métodos fiables para prevenir
            virus y otras amenazas informáticas.
          </p>
        </div>

        <div className="metodos-grid">

          <article className="metodo-card">
            <span>🔐</span>

            <h3>Contraseñas seguras</h3>

            <p>
              Utiliza contraseñas largas, únicas y difíciles de
              adivinar para proteger tus cuentas.
            </p>
          </article>

          <article className="metodo-card">
            <span>🛡️</span>

            <h3>Antivirus</h3>

            <p>
              Mantén un antivirus confiable actualizado para
              detectar y prevenir amenazas informáticas.
            </p>
          </article>

          <article className="metodo-card">
            <span>📧</span>

            <h3>Evitar phishing</h3>

            <p>
              No abras enlaces o archivos sospechosos recibidos
              por correo, mensajes o redes sociales.
            </p>
          </article>

          <article className="metodo-card">
            <span>🔄</span>

            <h3>Mantener el sistema actualizado</h3>

            <p>
              Instala las actualizaciones de seguridad del sistema
              operativo y de tus aplicaciones.
            </p>
          </article>

          <article className="metodo-card">
            <span>📥</span>

            <h3>Descargas seguras</h3>

            <p>
              Descarga programas y archivos únicamente desde
              fuentes confiables.
            </p>
          </article>

          <article className="metodo-card">
            <span>💾</span>

            <h3>Copias de seguridad</h3>

            <p>
              Realiza copias de seguridad periódicas para proteger
              tu información ante posibles ataques.
            </p>
          </article>

        </div>

        <div className="prevencion-aviso">
          💡 Próximamente podrás consultar información más detallada
          sobre cada método.
        </div>

        <button
          className="prevencion-volver"
          onClick={onVolver}
        >
          ← Volver al menú
        </button>

      </main>

    </div>
  );
}

export default MetodosPrevencion;