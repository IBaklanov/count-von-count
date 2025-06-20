export interface ApiResponse {
  success: boolean
  error?: string
  message?: string
}

export interface CounterData {
  id: string
  name: string
  value: number
  createdAt: string
  updatedAt: string
}

export interface CountRequest {
  counterId: string
  increment?: number
  metadata?: Record<string, any>
}

export interface CountResponse extends ApiResponse {
  data?: CounterData
}

