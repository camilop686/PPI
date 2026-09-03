import { ShieldCheck } from 'lucide-react'
import Page from '../components/Page'

export default function HomePage({ profile }) {
  return (
    <Page title={`Hola, ${profile?.full_name || 'persona protegida'}`}>
      <div className="hero">
        <div>
          <h2>La prevención empieza con decisiones informadas.</h2>
          <p>Explora guías verificables para proteger tus dispositivos, datos y cuentas.</p>
        </div>
        <ShieldCheck size={76} />
      </div>

      <section className="grid">
        {[
          ['12+', 'métodos prácticos'],
          ['8+', 'amenazas explicadas'],
          ['24/7', 'hábitos de seguridad'],
        ].map(([value, label]) => (
          <article className="stat" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>
    </Page>
  )
}
