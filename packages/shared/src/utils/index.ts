export function formatMessage(message: string): string {
  return `[Count Von Count] ${message}`
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function validateCounterId(id: string): boolean {
  return typeof id === 'string' && id.length > 0 && id.length <= 100
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

