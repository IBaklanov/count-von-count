import { formatMessage, ApiResponse } from '@count-von-count/shared'

export interface HelloRequest {
  name?: string
}

export interface HelloResponse extends ApiResponse {
  data: {
    message: string
    timestamp: string
  }
}

export default function handler(req: HelloRequest): HelloResponse {
  const name = req.name || 'World'
  
  return {
    success: true,
    data: {
      message: formatMessage(`Hello, ${name}!`),
      timestamp: new Date().toISOString()
    }
  }
}

