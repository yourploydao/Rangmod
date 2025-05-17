// buildVectors.mts (เนื่องจากใช้ esในts ไม่ได้เลยแยกไฟล์ออกมา)
import fs from 'fs'
import path from 'path'
import { getCombinedDormData } from './mongo'
import { getLocalEmbedding } from './embedding'

async function buildEmbeddingJson() {
  const data = await getCombinedDormData()
  console.log('🔍 ดึงหอพักสำเร็จ:', data.length, 'รายการ')

  const vectors = []

  for (const dorm of data) {
    const text = `${dorm.name} | ${dorm.full_location} | ${dorm.rooms.join(' / ')} | ${dorm.facilities.join(', ')}`
    console.log('📦 สร้าง embedding สำหรับ:', text)
    const embedding = await getLocalEmbedding(text)
    vectors.push({ text, embedding })
  }

  const filePath = path.join(process.cwd(), 'public/vector/dorm_vectors.json')
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(vectors, null, 2), 'utf-8')

  console.log('✅ บันทึก dorm_vectors.json เรียบร้อยแล้ว')
}

buildEmbeddingJson()
