import { useState } from 'react'
import { CounterData } from '@count-von-count/shared/src'

export default function Home() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleCount = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call to functions
      const response = await fetch('/api/count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'increment' }),
      })

      if (response.ok) {
        const data: CounterData = await response.json()
        setCount(data.count)
      }
    } catch (error) {
      console.error('Failed to increment count:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Count Von Count</h1>
      <p>Modern TypeScript counting solution</p>

      <div style={{ margin: '2rem 0' }}>
        <h2>Current Count: {count}</h2>
        <button
          onClick={handleCount}
          disabled={loading}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Counting...' : 'Count!'}
        </button>
      </div>

      <div style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#666' }}>
        <p>This is the modernized version of Count Von Count</p>
        <p>Built with Next.js, TypeScript, and Supabase</p>
      </div>
    </div>
  )
}
