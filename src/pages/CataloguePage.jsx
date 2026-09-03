import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import LoadingState from '../components/LoadingState'
import Notice from '../components/Notice'
import Page from '../components/Page'
import { fetchCatalogue } from '../services/catalogueService'
import { matchesSearch } from '../utils/content'
import { toUserMessage } from '../utils/errorMessages'

function MethodCard({ item }) {
  return (
    <article className="card" key={item.id}>
      <span className="tag">{item.risk_level || 'Método'}</span>
      <h2>{item.name}</h2>
      <p>{item.description}</p>
      <div className="details-list">
        <p><strong>Recomendaciones:</strong> {item.recommendations}</p>
        <p><strong>Explicación:</strong> {item.examples}</p>
        <p><strong>Qué hacer:</strong> {item.what_to_do}</p>
      </div>
    </article>
  )
}

function ThreatCard({ item }) {
  return (
    <article className="card" key={item.id}>
      <span className="tag">{item.category || 'Amenaza'}</span>
      <h2>{item.name}</h2>
      <div className="details-list">
        <p><strong>Descripción:</strong> {item.what_is}</p>
        <p><strong>Propagación:</strong> {item.how_spreads}</p>
        <p><strong>Prevención:</strong> {item.prevention}</p>
      </div>
    </article>
  )
}

export default function CataloguePage({
  table,
  title,
  kind,
  emptyMessage,
  filterKey,
  filterLabel,
}) {
  const [error, setError] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      const { data, error: requestError } = await fetchCatalogue(table)

      if (!active) {
        return
      }

      if (requestError) {
        setItems([])
        setError(toUserMessage(requestError, 'No fue posible cargar la información.'))
      } else {
        setItems(data ?? [])
        setError('')
      }

      setLoading(false)
    }

    load()

    return () => {
      active = false
    }
  }, [table])

  const filterOptions = useMemo(
    () => [...new Set(items.map(item => item[filterKey]).filter(Boolean))].sort((left, right) => left.localeCompare(right)),
    [filterKey, items],
  )

  const filteredItems = useMemo(
    () =>
      items.filter(item => matchesSearch(item, query)).filter(item => (filterValue ? item[filterKey] === filterValue : true)),
    [filterKey, filterValue, items, query],
  )

  return (
    <Page title={title}>
      <div className="toolbar">
        <Search size={18} />
        <input
          aria-label={`Buscar ${kind.toLowerCase()}s`}
          placeholder="Buscar en el catálogo..."
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <select
          aria-label={filterLabel}
          className="toolbar-select"
          value={filterValue}
          onChange={event => setFilterValue(event.target.value)}
        >
          <option value="">Todas</option>
          {filterOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {error && <Notice variant="error">{error}</Notice>}
      {loading && <LoadingState message="Cargando..." />}

      {!loading && !error && !items.length && <div className="empty">{emptyMessage}</div>}
      {!loading && !error && items.length > 0 && !filteredItems.length && (
        <div className="empty">No se encontraron resultados.</div>
      )}

      {!loading && !error && filteredItems.length > 0 && (
        <div className="grid cards">
          {filteredItems.map(item => (table === 'prevention_methods' ? <MethodCard item={item} key={item.id} /> : <ThreatCard item={item} key={item.id} />))}
        </div>
      )}
    </Page>
  )
}
