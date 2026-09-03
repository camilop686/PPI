import { useCallback, useEffect, useMemo, useState } from 'react'
import Notice from '../components/Notice'
import Page from '../components/Page'
import LoadingState from '../components/LoadingState'
import {
  createAdminEntry,
  deleteAdminEntry,
  deleteForumPost,
  deleteForumReply,
  fetchAdminCollection,
  fetchPendingForumPosts,
  fetchPendingForumReplies,
  updateAdminEntry,
  updateForumPostStatus,
  updateForumReplyStatus,
} from '../services/adminService'
import { cleanText } from '../utils/content'
import { toUserMessage } from '../utils/errorMessages'

const dangerConfirmationMessage = '¿Seguro que deseas eliminar este elemento? Esta acción no se puede deshacer.'

const methodFields = [
  ['name', 'Nombre', 'input'],
  ['description', 'Descripción', 'textarea'],
  ['risk_level', 'Nivel de riesgo', 'input'],
  ['recommendations', 'Recomendaciones', 'textarea'],
  ['examples', 'Explicación y ejemplos', 'textarea'],
  ['what_to_do', 'Qué hacer', 'textarea'],
]

const threatFields = [
  ['name', 'Nombre', 'input'],
  ['category', 'Categoría', 'input'],
  ['what_is', 'Descripción', 'textarea'],
  ['how_spreads', 'Cómo se propaga', 'textarea'],
  ['prevention', 'Cómo prevenirla', 'textarea'],
]

function AdminCollection({ fields, table, title }) {
  const emptyDraft = useMemo(
    () => Object.fromEntries(fields.map(([field]) => [field, ''])),
    [fields],
  )
  const [busy, setBusy] = useState(false)
  const [draft, setDraft] = useState(emptyDraft)
  const [message, setMessage] = useState('')
  const [variant, setVariant] = useState('info')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await fetchAdminCollection(table)

    if (error) {
      setVariant('error')
      setMessage(toUserMessage(error))
      setRows([])
    } else {
      setRows(data ?? [])
    }

    setLoading(false)
  }, [table])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [load])

  const resetDraft = () => {
    setDraft(emptyDraft)
  }

  const save = async event => {
    event.preventDefault()

    const payload = Object.fromEntries(
      fields.map(([field]) => [field, cleanText(draft[field])]),
    )

    if (Object.values(payload).some(value => !value)) {
      setVariant('error')
      setMessage('No fue posible completar la operación. Inténtalo nuevamente.')
      return
    }

    setBusy(true)
    const response = draft.id
      ? await updateAdminEntry(table, draft.id, payload)
      : await createAdminEntry(table, payload)
    setBusy(false)

    if (response.error) {
      setVariant('error')
      setMessage(toUserMessage(response.error))
      return
    }

    setVariant('success')
    setMessage(
      draft.id
        ? 'Elemento actualizado correctamente.'
        : 'Elemento creado correctamente.',
    )
    resetDraft()
    load()
  }

  const remove = async id => {
    if (!window.confirm(dangerConfirmationMessage)) {
      return
    }

    const { error } = await deleteAdminEntry(table, id)

    if (error) {
      setVariant('error')
      setMessage(toUserMessage(error))
      return
    }

    setVariant('success')
    setMessage('Elemento eliminado correctamente.')
    load()
  }

  return (
    <section className="admin-split">
      <form className="card form" onSubmit={save}>
        <h2>{draft.id ? 'Editar' : 'Crear'} {title}</h2>

        {fields.map(([field, label, type]) => (
          <label htmlFor={`${table}-${field}`} key={field}>
            {label}
            {type === 'textarea' ? (
              <textarea
                id={`${table}-${field}`}
                required
                value={draft[field] ?? ''}
                onChange={event => setDraft(current => ({ ...current, [field]: event.target.value }))}
              />
            ) : (
              <input
                id={`${table}-${field}`}
                required
                value={draft[field] ?? ''}
                onChange={event => setDraft(current => ({ ...current, [field]: event.target.value }))}
              />
            )}
          </label>
        ))}

        <div className="form-actions">
          <button disabled={busy} type="submit">
            {busy ? 'Guardando...' : draft.id ? 'Actualizar' : 'Crear'}
          </button>
          {draft.id && (
            <button className="link" onClick={resetDraft} type="button">
              Cancelar edición
            </button>
          )}
        </div>

        {message && <Notice variant={variant}>{message}</Notice>}
      </form>

      <div className="admin-list">
        {loading && <LoadingState message="Cargando..." />}
        {!loading &&
          rows.map(row => (
            <article className="comment" key={row.id}>
              <b>{row.name}</b>
              <p>{row.description || row.what_is}</p>
              <div className="card-actions">
                <button onClick={() => setDraft(row)} type="button">
                  Editar
                </button>
                <button className="danger" onClick={() => remove(row.id)} type="button">
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        {!loading && !rows.length && <div className="empty">No hay contenido registrado.</div>}
      </div>
    </section>
  )
}

function ModerationPanel() {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [variant, setVariant] = useState('info')
  const [posts, setPosts] = useState([])
  const [replies, setReplies] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    const [postsResponse, repliesResponse] = await Promise.all([
      fetchPendingForumPosts(),
      fetchPendingForumReplies(),
    ])

    if (postsResponse.error || repliesResponse.error) {
      setVariant('error')
      setMessage(toUserMessage(postsResponse.error || repliesResponse.error))
      setPosts([])
      setReplies([])
    } else {
      setPosts(postsResponse.data ?? [])
      setReplies(repliesResponse.data ?? [])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [load])

  const moderate = async (type, id, status) => {
    const response = type === 'post'
      ? await updateForumPostStatus(id, status)
      : await updateForumReplyStatus(id, status)

    if (response.error) {
      setVariant('error')
      setMessage(toUserMessage(response.error))
      return
    }

    setVariant('success')
    setMessage('Elemento actualizado correctamente.')
    load()
  }

  const remove = async (type, id) => {
    if (!window.confirm(dangerConfirmationMessage)) {
      return
    }

    const response = type === 'post' ? await deleteForumPost(id) : await deleteForumReply(id)

    if (response.error) {
      setVariant('error')
      setMessage(toUserMessage(response.error))
      return
    }

    setVariant('success')
    setMessage('Elemento eliminado correctamente.')
    load()
  }

  return (
    <section className="panel-stack">
      {message && <Notice variant={variant}>{message}</Notice>}

      {loading && <LoadingState message="Cargando..." />}

      {!loading && (
        <>
          <section className="card panel">
            <h2>Publicaciones pendientes</h2>
            <div className="feed">
              {posts.map(post => (
                <article className="comment" key={post.id}>
                  <span className="tag">Pendiente</span>
                  <b>{post.title}</b>
                  <p>{post.body}</p>
                  <small>
                    {post.profiles?.full_name || 'Miembro PPI'} · {new Date(post.created_at).toLocaleDateString('es-CO')}
                  </small>
                  <div className="card-actions">
                    <button onClick={() => moderate('post', post.id, 'approved')} type="button">
                      Aprobar
                    </button>
                    <button className="danger" onClick={() => moderate('post', post.id, 'rejected')} type="button">
                      Rechazar
                    </button>
                    <button className="ghost-action" onClick={() => remove('post', post.id)} type="button">
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
              {!posts.length && <div className="empty">No hay publicaciones pendientes.</div>}
            </div>
          </section>

          <section className="card panel">
            <h2>Respuestas pendientes</h2>
            <div className="feed">
              {replies.map(reply => (
                <article className="comment" key={reply.id}>
                  <span className="tag">Pendiente</span>
                  <b>{reply.forum_posts?.title || 'Respuesta de la comunidad'}</b>
                  <p>{reply.body}</p>
                  <small>
                    {reply.profiles?.full_name || 'Miembro PPI'} · {new Date(reply.created_at).toLocaleDateString('es-CO')}
                  </small>
                  <div className="card-actions">
                    <button onClick={() => moderate('reply', reply.id, 'approved')} type="button">
                      Aprobar
                    </button>
                    <button className="danger" onClick={() => moderate('reply', reply.id, 'rejected')} type="button">
                      Rechazar
                    </button>
                    <button className="ghost-action" onClick={() => remove('reply', reply.id)} type="button">
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
              {!replies.length && <div className="empty">No hay respuestas pendientes.</div>}
            </div>
          </section>
        </>
      )}
    </section>
  )
}

export default function AdminPage() {
  const [view, setView] = useState('methods')

  return (
    <Page title="Centro de control">
      <div className="admin-tabs" role="tablist" aria-label="Vistas administrativas">
        {[
          ['methods', 'Métodos'],
          ['threats', 'Amenazas'],
          ['community', 'Moderación'],
        ].map(([id, label]) => (
          <button
            className={view === id ? 'active' : ''}
            key={id}
            onClick={() => setView(id)}
            role="tab"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'methods' && (
        <AdminCollection fields={methodFields} table="prevention_methods" title="método" />
      )}
      {view === 'threats' && (
        <AdminCollection fields={threatFields} table="threats" title="amenaza" />
      )}
      {view === 'community' && <ModerationPanel />}
    </Page>
  )
}
