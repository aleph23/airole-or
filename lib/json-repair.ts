import { jsonrepair } from 'jsonrepair'

export interface ParseResult {
  data: Record<string, any>
  wasRepaired: boolean
  fieldsFound: string[]
}

const KNOWN_FIELDS = ['name', 'description', 'personality', 'scenario', 'first_mes', 'mes_example', 'tags', 'character_book']

export function resilientParse(raw: string): ParseResult {
  const cleaned = raw.trim()

  // Fast path: strict parse
  try {
    const data = JSON.parse(cleaned)
    return { data, wasRepaired: false, fieldsFound: KNOWN_FIELDS.filter(k => k in data && data[k]) }
  } catch { /* fall through */ }

  // Repair and parse
  try {
    const repaired = jsonrepair(cleaned)
    const data = JSON.parse(repaired)
    const fieldsFound = KNOWN_FIELDS.filter(k => k in data && data[k])
    return { data, wasRepaired: true, fieldsFound }
  } catch (err) {
    throw new Error(`Could not parse or repair JSON: ${err}`)
  }
}
