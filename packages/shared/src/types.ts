// Core counting types
export interface CounterData {
  counter_name: string
  count: number
  timestamp: string
}

export interface CountRequest {
  action: 'increment' | 'get' | 'reset'
  counter_name?: string
  increment?: number
}

export interface CounterConfig {
  name: string
  description?: string
  initial_value?: number
  max_value?: number
  ttl?: number // Time to live in seconds
}

// Leaderboard types (for ordered sets functionality)
export interface LeaderboardEntry {
  id: string
  name: string
  score: number
  rank: number
  timestamp: string
}

export interface LeaderboardRequest {
  leaderboard_name: string
  limit?: number
  offset?: number
}

// Metadata plugin types
export interface RequestMetadata {
  timestamp: string
  ip_address?: string
  user_agent?: string
  country?: string
  city?: string
}

export interface CountWithMetadata extends CounterData {
  metadata: RequestMetadata
}

// Database types
export interface DatabaseCounter {
  id: string
  name: string
  count: number
  created_at: string
  updated_at: string
  expires_at?: string
}

export interface DatabaseLeaderboard {
  id: string
  name: string
  entries: LeaderboardEntry[]
  created_at: string
  updated_at: string
}
