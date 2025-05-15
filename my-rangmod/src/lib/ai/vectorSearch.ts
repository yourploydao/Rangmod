// src/lib/ai/vectorSearch.ts
import fs from 'fs'
import path from 'path'
import { getLocalEmbedding } from './embedding'

type VectorItem = {
  text: string
  embedding: number[]
}

const filePath = path.join(process.cwd(), 'public/vector/dorm_vectors.json')

function cosineSimilarity(vecA: number[], vecB: number[]) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
  return dot / (magA * magB)
}

export async function searchSimilar(query: string, topK = 3): Promise<string[]> {
  const vectors: VectorItem[] = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const queryVec = await getLocalEmbedding(query)

  const ranked = vectors
    .map((v) => ({
      text: v.text,
      score: cosineSimilarity(queryVec, v.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)

  return ranked.map(r => r.text)
}
