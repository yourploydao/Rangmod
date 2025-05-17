// src/app/api/ai/context/route.ts
import { searchSimilar } from "../../../../lib/ai/vectorSearch"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { query } = await req.json()
  const results = await searchSimilar(query)
  return NextResponse.json({ context: results.join("\n") })
}

