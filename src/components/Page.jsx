export default function Page({ title, children, eyebrow = 'PPI · aprendizaje seguro' }) {
  return (
    <>
      <header className="pagehead">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
      </header>
      {children}
    </>
  )
}
