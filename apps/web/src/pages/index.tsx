import { formatMessage } from '@count-von-count/shared'

export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Count Von Count</h1>
      <p>{formatMessage('Welcome to the counting server!')}</p>
      <p>This is a modern TypeScript mono-repo with:</p>
      <ul>
        <li>Next.js web application</li>
        <li>Serverless functions</li>
        <li>Shared packages</li>
        <li>GitHub CI/CD</li>
        <li>Supabase integration</li>
      </ul>
    </div>
  )
}

