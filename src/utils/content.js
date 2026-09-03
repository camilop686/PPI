export function cleanText(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalizeSearch(value) {
  return cleanText(value)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export function matchesSearch(item, query) {
  if (!cleanText(query)) {
    return true
  }

  const searchTerm = normalizeSearch(query)

  return Object.values(item).some(value =>
    typeof value === 'string' && normalizeSearch(value).includes(searchTerm),
  )
}
