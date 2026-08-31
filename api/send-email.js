export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Missing API key' })
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()
    if (!response.ok) {
      console.error('Resend error:', data)
      return res.status(response.status).json(data)
    }
    return res.status(200).json(data)
  } catch (err) {
    console.error('send-email handler error:', err)
    return res.status(500).json({ error: err.message })
  }
}
