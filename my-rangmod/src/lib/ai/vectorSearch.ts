// src/lib/ai/vectorSearch.ts
import { getLocalEmbedding } from "./embedding"
import { getCombinedDormData } from "./mongo"

const keywordMap: Record<string, string> = {
  'หน้ามหาวิทยาลัย': 'Front Gate',
  'หลังมหาวิทยาลัย': 'Back Gate',
  'อพาร์ทเมนท์': 'Apartment',
  'แมนชัน': 'Mansion',
  'หอพัก': 'Dormitory',
  'คอนโดมิเนียม': 'Condominium',
  'บ้าน': 'House',
  'ทาวน์เฮาส์': 'Townhouse',
  'ที่พักอาศัยหญิง': 'Female',
  'ที่พักอาศัยชาย': 'Male',
  'ที่พักอาศัยรวม': 'Mixed',
  'ไวไฟ': 'wifi',
  'เครื่องปรับอากาศ': 'air_conditioner',
  'ตู้เย็น': 'refrigerator',
  'โทรทัศน์': 'television',
  'ตู้เสื้อผ้า': 'closet',
  'ไมโครเวฟ': 'microwave',
  'ระเบียง': 'balcony',
  'กล้องวงจรปิด': 'cctv',
  'โต๊ะทำงาน': 'desk',
  'ที่จอดรถ': 'parking',
  'ห้องครัว': 'kitchen',
  'เครื่องทำน้ำอุ่น': 'water_heater',
  'ร้านสะดวกซื้อ': 'convenience_store',
  'ร้านซักรีด': 'laundry',
  'พัดลม': 'fan',
  // เพิ่มได้เรื่อยๆ
}

function cosineSimilarity(vecA: number[], vecB: number[]) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
  return dot / (magA * magB)
}

export async function searchSimilar(query: string, topK = 2): Promise<string[]> {
  const dorms = await getCombinedDormData() // ← ใช้ข้อมูลจริงที่รวมจาก MongoDB

  // 🧠 แปลง keyword ภาษาไทย → อังกฤษ
  for (const [th, en] of Object.entries(keywordMap)) {
    if (query.includes(th)) query = query.replace(th, en)
  }

  const queryVec = await getLocalEmbedding(query)

  const scored = await Promise.all(
    dorms.map(async dorm => {
      const docText = [
        dorm.name,
        ...dorm.facilities || [],
        ...dorm.room_details?.flatMap(r => [r.room_type, r.price]) || []
      ].join(" ")

      const emb = await getLocalEmbedding(docText)
      return {
        text: `${dorm.name} มี ${dorm.facilities?.join(", ")}`,
        score: cosineSimilarity(queryVec, emb)
      }
    })
  )

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(x => x.text)
}
