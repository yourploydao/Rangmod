import { generateAnswer } from '../../../lib/ai/chat'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message } = req.body
  if (!message) return res.status(400).json({ error: 'Missing question' })

  const answer = await generateAnswer(message)
  res.status(200).json({ answer })
}