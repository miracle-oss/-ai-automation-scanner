import { useState } from 'react'

export default function App() {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const scanSite = async () => {
    setLoading(true)
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, email }),
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>🔍 AI Automation Scanner</h1>
      <input
        type="email"
        placeholder="Your email (VIP gets unlimited)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <input
        type="text"
        placeholder="Enter a website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <button onClick={scanSite} disabled={loading}>
        {loading ? 'Scanning...' : 'Scan Now'}
      </button>
      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
