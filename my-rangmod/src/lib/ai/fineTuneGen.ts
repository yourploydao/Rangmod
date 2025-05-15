// src/lib/ai/fineTuneGen.ts
import fs from 'fs'
import path from 'path'
import { getCombinedDormData } from './mongo'

function getRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export async function exportToJsonl() {
  try {
    console.log('📦 กำลังโหลดข้อมูลหอพัก...')
    const dorms = await getCombinedDormData()
    console.log(`✅ โหลดข้อมูลสำเร็จ ${dorms.length} รายการ`)

    const lines: string[] = []

    // ✅ Map: สิ่งอำนวยความสะดวก → รายชื่อหอ
    const facToDorms: Record<string, string[]> = {}
    dorms.forEach(dorm => {
      dorm.facilities.forEach((fac: string) => {
        if (!facToDorms[fac]) facToDorms[fac] = []
        facToDorms[fac].push(dorm.name)
      })
    })

    // ✅ คำถามรวม: "มีหอพักไหนที่มี .... บ้าง"
    Object.entries(facToDorms).forEach(([fac, dormList]) => {
      if (dormList.length > 1) {
        const selected = getRandom(dormList, Math.min(5, dormList.length))
        lines.push(JSON.stringify({
          messages: [
            { role: 'user', content: `มีหอพักไหนที่มี ${fac} บ้าง` },
            { role: 'assistant', content: `หอพักที่มี ${fac} (ไม่เกิน 5 รายชื่อ) เช่น: ${selected.join(', ')} เป็นต้น.` }
          ]
        }))
      }
    })

    for (const dorm of dorms) {
      const {
        name,
        type_dormitory,
        category_dormitory,
        full_location,
        rooms,
        facilities,
        room_type,
        price_range,
        description,
        electric_price,
        water_price,
        other,
        distance_from_university,
        agreement,
        contract_duration,
        num_of_rooms,
        phone_number
      } = dorm as any

      const roomsDetail = rooms.map((r: string) => r).join(', ') || 'ไม่มีข้อมูลห้องพัก'
      const facList = facilities || []
      const facText = facList.join(', ') || 'ไม่มีข้อมูลสิ่งอำนวยความสะดวก'
      const facPreview = getRandom(facList, Math.min(3, facList.length)).join(', ') || 'ไม่ระบุ'

      const qaPairs = [
        { q: `หอพัก ${name} ตั้งอยู่แถวไหน`, a: `${name} ตั้งอยู่ที่ ${full_location}` },
        { q: `สิ่งอำนวยความสะดวกของ ${name} มีอะไรบ้าง`, a: `${name} มี: ${facText}` },
        { q: `ราคาเช่าห้องของ ${name} เท่าไหร่`, a: `${name} มีราคาห้องอยู่ในช่วง ${price_range} บาท` },
        { q: `รายละเอียดห้องพักของ ${name} มีอะไรบ้าง`, a: `${name} มีห้องพักแบบ: ${roomsDetail}` },
        { q: `หอพัก ${name} อยู่ไกลจากมหาวิทยาลัยแค่ไหน`, a: `${name} อยู่ห่าง ${distance_from_university} กม.` },
        { q: `ต้องทำสัญญานานเท่าไรกับ ${name}`, a: `${name} ต้องทำสัญญาขั้นต่ำ ${contract_duration} เดือน (${agreement})` },
        { q: `ค่าไฟ ค่าน้ำ ที่ ${name} เป็นยังไง`, a: `ค่าไฟ ${electric_price} บาท/หน่วย, ค่าน้ำ ${water_price} บาท` },
        { q: `ที่ ${name} มีบริการอื่นเพิ่มเติมไหม`, a: `มีค่าใช้จ่ายเพิ่มเติมประมาณ ${other ?? 'ไม่ระบุ'} บาท/เดือน` },
        { q: `อยากจอง ${name} ต้องติดต่อใคร`, a: `โทรจองได้ที่ ${phone_number}` },
        { q: `หอพัก ${name} เหมาะกับใคร`, a: `${name} เหมาะกับผู้ต้องการความสะดวกสบาย เช่น ${facPreview}` },
        { q: `ห้องพักแบบ ${room_type} ของ ${name} ราคาเท่าไร`, a: `${rooms}` },
        { q: `หอพัก ${name} มีจุดเด่นอะไร`, a: `${name} มีสิ่งอำนวยความสะดวกเช่น ${facText}` },
        { q: `สามารถอยู่ที่ ${name} ได้สั้นสุดกี่เดือน`, a: `${name} ต้องอยู่ขั้นต่ำ ${contract_duration} เดือน` },
        { q: `หอพัก ${name} มีทั้งหมดกี่ห้อง`, a: `${name} มีห้องทั้งหมด ${num_of_rooms ?? rooms.length} ห้อง` },
        { q: `ที่ ${name} ปลอดภัยแค่ไหน`, a: `${name} มีระบบรักษาความปลอดภัย เช่น ${facText.includes('cctv') ? 'CCTV' : 'ไม่ระบุ'}` },
        { q: `สามารถทำสัญญาระยะสั้นกับ ${name} ได้ไหม`, a: `${name} ต้องทำสัญญาอย่างน้อย ${contract_duration} เดือน` },
        { q: `หอพัก ${name} รับผู้พักกลุ่มไหน`, a: `${name} เป็นหอสำหรับ ${category_dormitory}` },
        { q: `หอพัก ${name} เป็นหอชายหรือหอหญิง`, a: `${name} เป็นหอสำหรับ ${category_dormitory}` },
        { q: `หอพัก ${name} เป็นที่พักประเภทอะไร`, a: `${name} เป็นที่พักประเภท ${type_dormitory}` }
      ]

      const selected = getRandom(qaPairs, Math.floor(Math.random() * 4) + 10)
      selected.forEach(({ q, a }) => {
        lines.push(JSON.stringify({
          messages: [
            { role: 'user', content: q },
            { role: 'assistant', content: a }
          ]
        }))
      })
    }

    const filePath = path.join(process.cwd(), 'fine-tune-dataset.jsonl')
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8')
    console.log(`✅ บันทึกไฟล์ที่: ${filePath}`)
    console.log(`📊 ตัวอย่างรวม: ${lines.length}`)
  } catch (err) {
    console.error('❌ เกิดข้อผิดพลาด:', err)
  }
}

exportToJsonl()
