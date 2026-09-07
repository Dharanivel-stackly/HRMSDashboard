export function serializeRequestBody(data: unknown): string | undefined {
  if (data === undefined || data === null) return undefined
  if (typeof data === 'string') return data
  return JSON.stringify(data)
}

export function parseRequestBody<T = unknown>(data: unknown): T {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as T
    } catch {
      return data as T
    }
  }
  return data as T
}
