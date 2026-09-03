import { useCallback, useEffect, useState } from 'react'
import LoadingState from '../components/LoadingState'
import Notice from '../components/Notice'
import Page from '../components/Page'
import {
  createForumPost,
  createForumReply,
  fetchForumPosts,
  fetchForumReplies,
} from '../services/communityService'
import { cleanText } from '../utils/content'
import { toUserMessage } from '../utils/errorMessages'

const categories = ['General', 'Prevención', 'Amenazas', 'Ayuda técnica']
const statusLabels = {
  approved: 'Aprobado',
  pending: 'Pendiente',
  rejected: 'Rechazado',
}

export default function CommunityPage({ session }) {
  const [body, setBody] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [loadingTopics, setLoadingTopics] = useState(true)
  const [message, setMessage] = useState('')
  const [messageVariant, setMessageVariant] = useState('info')
  const [reply, setReply] = useState('')
  const [replies, setReplies] = useState([])
  const [selected, setSelected] = useState(null)
  const [title, setTitle] = useState('')
  const [topics, setTopics] = useState([])

  const setFeedback = (variant, text) => {
    setMessageVariant(variant)
    setMessage(text)
  }

  const loadTopics = useCallback(async selectedId => {
    setLoadingTopics(true)
    const { data, error } = await fetchForumPosts(session.user.id)

    if (error) {
      setTopics([])
      setFeedback('error', toUserMessage(error))
    } else {
      const nextTopics = data ?? []
      setTopics(nextTopics)
      setMessage('')

      if (selectedId) {
        setSelected(nextTopics.find(topic => topic.id === selectedId) ?? null)
      }
    }

    setLoadingTopics(false)
  }, [session.user.id])

  const loadReplies = useCallback(async topicId => {
    setLoadingReplies(true)
    const { data, error } = await fetchForumReplies(topicId, session.user.id)

    if (error) {
      setReplies([])
      setFeedback('error', toUserMessage(error))
    } else {
      setReplies(data ?? [])
    }

    setLoadingReplies(false)
  }, [session.user.id])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTopics(selected?.id)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadTopics, selected?.id])

  useEffect(() => {
    if (!selected) {
      return
    }

    const timer = window.setTimeout(() => {
      void loadReplies(selected.id)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadReplies, selected])

  const handleCreateTopic = async event => {
    event.preventDefault()

    const nextTitle = cleanText(title)
    const nextBody = cleanText(body)

    if (nextTitle.length < 6 || nextBody.length < 1) {
      setFeedback('error', 'Completa un título válido y una publicación con contenido.')
      return
    }

    const { error } = await createForumPost({
      authorId: session.user.id,
      body: nextBody,
      category,
      title: nextTitle,
    })

    if (error) {
      setFeedback('error', toUserMessage(error))
      return
    }

    setFeedback('success', 'Publicación enviada a moderación.')
    setTitle('')
    setBody('')
    loadTopics(selected?.id)
  }

  const handleCreateReply = async event => {
    event.preventDefault()

    const nextReply = cleanText(reply)

    if (!nextReply) {
      setFeedback('error', 'La respuesta no puede estar vacía.')
      return
    }

    const { error } = await createForumReply({
      authorId: session.user.id,
      body: nextReply,
      postId: selected.id,
    })

    if (error) {
      setFeedback('error', toUserMessage(error))
      return
    }

    setFeedback('success', 'Respuesta enviada a moderación.')
    setReply('')
    loadReplies(selected.id)
  }

  if (selected) {
    const canReply = selected.status === 'approved' && !selected.locked

    return (
      <Page title={selected.title}>
        <button className="link" onClick={() => setSelected(null)} type="button">
          ← Volver al foro
        </button>

        {message && <Notice variant={messageVariant}>{message}</Notice>}

        <article className="card forum-topic">
          <div className="card-meta">
            <span className="tag">{selected.category}</span>
            <span className={`status-pill status-pill--${selected.status}`}>{statusLabels[selected.status]}</span>
          </div>
          <p>{selected.body}</p>
          <small>Iniciado por {selected.profiles?.full_name || 'Miembro PPI'}</small>
        </article>

        {loadingReplies && <LoadingState message="Cargando..." />}
        {!loadingReplies && replies.length > 0 && (
          <div className="feed">
            {replies.map(item => (
              <article className="comment" key={item.id}>
                <div className="card-meta">
                  <b>{item.profiles?.full_name || 'Miembro PPI'}</b>
                  <span className={`status-pill status-pill--${item.status}`}>{statusLabels[item.status]}</span>
                </div>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        )}
        {!loadingReplies && !replies.length && <div className="empty">Aún no hay respuestas visibles.</div>}

        {canReply ? (
          <form className="card composer" onSubmit={handleCreateReply}>
            <h2>Responder</h2>
            <textarea
              required
              maxLength="2000"
              value={reply}
              onChange={event => setReply(event.target.value)}
            />
            <button type="submit">Enviar respuesta</button>
          </form>
        ) : (
          <Notice variant="info">
            Solo puedes responder cuando la publicación esté aprobada y desbloqueada.
          </Notice>
        )}
      </Page>
    )
  }

  return (
    <Page title="Foro de la comunidad">
      <div className="forum-layout">
        <form className="card composer" onSubmit={handleCreateTopic}>
          <p className="eyebrow">ABRIR UN TEMA</p>

          <label htmlFor="community-title">
            Título
            <input
              id="community-title"
              required
              minLength="6"
              maxLength="120"
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </label>

          <label htmlFor="community-category">
            Categoría
            <select
              id="community-category"
              value={category}
              onChange={event => setCategory(event.target.value)}
            >
              {categories.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="community-body">
            Publicación
            <textarea
              id="community-body"
              required
              maxLength="4000"
              placeholder="Describe tu duda o recomendación..."
              value={body}
              onChange={event => setBody(event.target.value)}
            />
          </label>

          <button type="submit">Enviar tema a moderación</button>
        </form>

        <section className="forum-stream">
          <p className="eyebrow">PUBLICACIONES</p>
          <p className="section-copy">Ves las publicaciones aprobadas y tus aportes en revisión para mantener coherencia con la moderación.</p>

          {message && <Notice variant={messageVariant}>{message}</Notice>}
          {loadingTopics && <LoadingState message="Cargando..." />}

          {!loadingTopics &&
            topics.map(topic => (
              <button className="forum-row" key={topic.id} onClick={() => setSelected(topic)} type="button">
                <div className="card-meta">
                  <span className="tag">{topic.category}</span>
                  <span className={`status-pill status-pill--${topic.status}`}>{statusLabels[topic.status]}</span>
                </div>
                <b>{topic.title}</b>
                <small>
                  {topic.profiles?.full_name || 'Miembro PPI'} · {new Date(topic.created_at).toLocaleDateString('es-CO')}
                </small>
              </button>
            ))}

          {!loadingTopics && !topics.length && <div className="empty">No hay publicaciones disponibles.</div>}
        </section>
      </div>
    </Page>
  )
}
