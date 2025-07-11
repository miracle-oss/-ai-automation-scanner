import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const users = {}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

app.post('/api/scan', async (req, res) => {
  const { url, email } = req.body

  // Free user limit: 3 scans per 2 weeks
  const isVIP = email === 'miracleorobo@gmail.com'
  const now = Date.now()

  if (!isVIP) {
    const user = users[email] || { scans: [] }
    user.scans = user.scans.filter((t) => now - t < 14 * 24 * 60 * 60 * 1000)

    if (user.scans.length >= 3) {
      return res.status(403).json({ message: 'Scan limit reached. Upgrade to VIP.' })
    }

    user.scans.push(now)
    users[email] = user
  }

  const prompt = `List possible AI automation opportunities for the website: ${url}`

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    })
    res.json({ ideas: response.data.choices[0].message.content })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
