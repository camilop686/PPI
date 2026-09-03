export default function LoadingState({ message = 'Cargando...' }) {
  return (
    <div className="center loading-state" role="status" aria-live="polite">
      <span className="spinner" />
      {message}
    </div>
  )
}
