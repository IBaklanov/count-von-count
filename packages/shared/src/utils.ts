import { CounterData, RequestMetadata } from './types'

/**
 * Validates a counter name to ensure it follows naming conventions
 */
export function validateCounterName(name: string): boolean {
  // Allow alphanumeric, hyphens, underscores, and dots
  const validPattern = /^[a-zA-Z0-9._-]+$/
  return validPattern.test(name) && name.length > 0 && name.length <= 100
}

/**
 * Sanitizes a counter name by removing invalid characters
 */
export function sanitizeCounterName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 100)
}

/**
 * Formats a count value for display
 */
export function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

/**
 * Creates request metadata from request headers
 */
export function createRequestMetadata(
  headers: Record<string, string>
): RequestMetadata {
  return {
    timestamp: new Date().toISOString(),
    ip_address: headers['x-forwarded-for'] || headers['x-real-ip'],
    user_agent: headers['user-agent'],
    // Country and city would be populated by geolocation service
  }
}

/**
 * Validates increment value
 */
export function validateIncrement(increment: number): boolean {
  return (
    Number.isInteger(increment) && increment >= -1000000 && increment <= 1000000
  )
}

/**
 * Creates a default counter data object
 */
export function createDefaultCounterData(name: string): CounterData {
  return {
    counter_name: name,
    count: 0,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Calculates time until expiration
 */
export function getTimeUntilExpiration(expiresAt: string): number {
  const expiration = new Date(expiresAt).getTime()
  const now = Date.now()
  return Math.max(0, expiration - now)
}

/**
 * Checks if a counter has expired
 */
export function isCounterExpired(expiresAt?: string): boolean {
  if (!expiresAt) return false
  return new Date(expiresAt).getTime() <= Date.now()
}
