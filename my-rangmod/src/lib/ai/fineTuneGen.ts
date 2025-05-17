// ✅ สร้าง dataset แบบละเอียด พร้อม Q&A หลากหลาย
import fs from 'fs'
import path from 'path'
import { getCombinedDormData } from './mongo'

function getRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export async function exportToJsonl() {
  const dorms = await getCombinedDormData()
  const lines: string[] = []

  const facToDorms: Record<string, string[]> = {}
  const roomToDorms: Record<string, string[]> = {}

  dorms.forEach(dorm => {
    dorm.room_details?.forEach((room: any) => {
      if (!roomToDorms[room.room_type]) roomToDorms[room.room_type] = []
      roomToDorms[room.room_type].push(dorm.name)
    })
    dorm.facilities?.forEach((fac: string) => {
      if (!facToDorms[fac]) facToDorms[fac] = []
      facToDorms[fac].push(dorm.name)
    })
  })

  for (const dorm of dorms) {
    const {
      name,
      full_location,
      distance_from_university,
      phone_number,
      price_range,
      contract_duration,
      electric_price,
      water_price,
      other,
      type_dormitory,
      category_dormitory,
      num_of_rooms,
      description,
      gate_location,
      agreement,
      room_details,
      facilities
    } = dorm

    const facText = facilities?.join(', ') || 'ไม่ระบุ'
    const roomText = room_details?.map((r: any) => r.room_type).join(', ') || 'ไม่มีข้อมูลห้อง'
    const roomDetailStr = room_details?.map((r: any) =>
      '• ' + r.room_type + ' ขนาด ' + r.size + ' ตร.ม. ราคา ' + r.price + ' บาท (' + (r.available ? 'ว่าง' : 'ไม่ว่าง') + ')'
    ).join('/n') || 'ไม่มีข้อมูล'

    const qa: { q: string, a: string }[] = [
      { q: `${name} ตั้งอยู่ที่ไหน`, a: `${name} ตั้งอยู่ที่ ${full_location}` },
      { q: `มีสิ่งอำนวยความสะดวกอะไรบ้างใน ${name}`, a: `${facText}` },
      { q: `ติดต่อ ${name} ได้อย่างไร`, a: `เบอร์โทร ${phone_number}` },
      { q: `จะติดต่อ ${name} เบอร์อะไร`, a: `โทรหาได้ที่ ${phone_number}` },
      { q: `เบอร์ของ ${name}`, a: `${phone_number}` },
      { q: `${name} มี facility อะไรบ้างและราคาเท่าไหร่`, a: `มี ${facText} ราคาประมาณ ${price_range} บาท` },
      { q: `ทำสัญญากับ ${name} ต้องอยู่นานเท่าไหร่`, a: `${contract_duration} เดือน` },
      { q: `ค่าไฟและค่าน้ำของ ${name} เท่าไหร่`, a: `ไฟ ${electric_price}/หน่วย, น้ำ ${water_price}/หน่วย` },
      { q: `ค่าใช้จ่ายเพิ่มเติมของ ${name}`, a: `${other || 'ไม่มีข้อมูล'}` },
      { q: `ประเภทของ ${name}`, a: `${type_dormitory}` },
      { q: `เหมาะกับใคร`, a: `${name} เป็นหอพักสำหรับ ${category_dormitory}` },
      { q: `หอพัก ${name} มีทั้งหมดกี่ห้อง`, a: `${num_of_rooms || room_details?.length} ห้อง` },
      { q: `หอพัก ${name} อยู่ห่างจากมหาวิทยาลัยเท่าไหร่`, a: `${distance_from_university} กม.` },
      { q: `${name} ใกล้มหาวิทยาลัยมั้ย`, a: distance_from_university < 1 ? 'ใกล้มาก เดินได้' : `ห่าง ${distance_from_university} กม.` },
      { q: `เข้า ${name} ได้จากทางไหน`, a: `${gate_location}` },
      { q: `${name} อยู่ฝั่งประตูไหน`, a: `${gate_location}` },
      { q: `รายละเอียดของสัญญา ${name}`, a: `${agreement || 'ไม่มีข้อมูล'}` },
      { q: `ภาพรวมของ ${name}`, a: `${description || 'ไม่มีคำอธิบาย'}` },
      { q: `ห้องพักของ ${name} มีแบบไหนบ้าง`, a: roomText },
      { q: `รายละเอียดห้องพักใน ${name}`, a: roomDetailStr },
      { q: `ราคาเช่าห้องของ ${name} เท่าไหร่`, a: `${name} มีราคาห้องอยู่ในช่วง ${price_range} บาท`},
      { q: `${name} เหมาะกับนักศึกษามั้ย`, a: `${name} เหมาะกับนักศึกษาหอ ${category_dormitory}` },
      { q: `${name} ปลอดภัยไหม`, a: facilities?.includes("cctv") ? `${name} มี CCTV` : `${name} ไม่มีข้อมูลเรื่องกล้องวงจรปิด` },
      { q: `${name} มีตู้เย็นมั้ย`, a: facilities?.includes('refrigerator') ? 'มี' : 'ไม่มี' },
    ]

     // ✅ เพิ่ม Q&A จาก room_details
    room_details?.forEach((room: any) => {
      qa.push({
        q: `ห้อง ${room.room_type} ของ ${name} ราคาเท่าไหร่`,
        a: `${room.price} บาท`
      })
      qa.push({
        q: `ห้อง ${room.room_type} ขนาดเท่าไหร่`,
        a: `${room.size} ตร.ม.`
      })
      qa.push({
        q: `ห้อง ${room.room_type} ของ ${name} ว่างไหม`,
        a: room.available ? 'ว่างอยู่' : 'ไม่ว่าง'
      })
      facilities?.forEach ((fac: string) => {
        qa.push({
          q: `ห้อง ${room.room_type} ของ ${name} มี ${fac} ไหม`,
          a: facilities.includes(fac) ? 'มี' : 'ไม่มี'
        })
      })
    })

     // ✅ push เข้า dataset
    qa.forEach(({ q, a }) => {
      if (!q.includes('undefined') && !a.includes('undefined')) {
        lines.push(JSON.stringify({
          prompt: `คุณคือแชทบอทแนะนำหอพักในประเทศไทย ห้ามใช้ภาษาจีน และให้ตอบเฉพาะภาษาไทยหรืออังกฤษเท่านั้น\n\nQ: ${q}\nA:`,
          completion: ` ${a}`
        }))
      }
    })
  }

   // ✅ คำถามรวม: หอไหนมี ___ บ้าง
  Object.entries(facToDorms).forEach(([fac, dormList]) => {
    if (dormList.length > 1) {
      const selected = getRandom(dormList, Math.min(5, dormList.length))
      lines.push(JSON.stringify({
        prompt: `คุณคือแชทบอทแนะนำหอพักในประเทศไทย ห้ามใช้ภาษาจีน และให้ตอบเฉพาะภาษาไทยหรืออังกฤษเท่านั้น\n\nQ: มีหอพักไหนที่มี ${fac} บ้าง\nA:`,
        completion: ` หอพักที่มี ${fac} เช่น(สูงสุด 5 รายชื่อ): ${selected.join(', ')} เป็นต้น`
      }))
    }
  })

   // ✅ คำถามรวม: ห้อง Room X อยู่ในหอไหนบ้าง
  Object.entries(roomToDorms).forEach(([type, dormList]) => {
    if (dormList.length > 1) {
      const selected = getRandom(dormList, Math.min(5, dormList.length))
      lines.push(JSON.stringify({
        prompt: `คุณคือแชทบอทแนะนำหอพักในประเทศไทย ห้ามใช้ภาษาจีน และให้ตอบเฉพาะภาษาไทยหรืออังกฤษเท่านั้น\n\nQ: ห้อง ${type} อยู่ในหอไหนบ้าง\nA:`,
        completion: ` ห้อง ${type} มีในหอ เช่น(สูงสุด 5 รายชื่อ): ${selected.join(', ')} เป็นต้น`
      }))
    }
  })

  const customQA = [
    {
      q: "wifi",
      a: "หอพักที่มี wifi เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "air Conditioner",
      a: "หอพักที่มี air Conditioner เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "private Bathroom",
      a: "หอพักที่มี private Bathroom เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "refrigerator",
      a: "หอพักที่มี refrigerator เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "airConditioner",
      a: "หอพักที่มี airConditioner เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "television",
      a: "หอพักที่มี television เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "closet",
      a: "หอพักที่มี closet เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "cctv",
      a: "หอพักที่มี cctv เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "parking",
      a: "หอพักที่มี parking เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "kitchen",
      a: "หอพักที่มี kitchen เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "microwave",
      a: "หอพักที่มี microwave เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "desk",
      a: "หอพักที่มี desk เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "balcony",
      a: "หอพักที่มี balcony เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "ไวไฟ",
      a: "หอพักที่มี wifi เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "แอร์",
      a: "หอพักที่มี air Conditioner เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "เครื่องปรับอากาศ",
      a: "หอพักที่มี air Conditioner เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "ห้องน้ำในตัว",
      a: "หอพักที่มี private Bathroom เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "ตู้เย็น",
      a: "หอพักที่มี refrigerator เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "ทีวี",
      a: "หอพักที่มี television เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "ระเบียง",
      a: "หอพักที่มี balcony เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "ครัว",
      a: "หอพักที่มี kitchen เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "ไมโครเวฟ",
      a: "หอพักที่มี microwave เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "กลัองวงจรปิด",
      a: "หอพักที่มี cctv เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "โต๊ะ",
      a: "หอพักที่มี desk เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "ทีจอดรถ",
      a: "หอพักที่มี parking เช่น(สูงสุด 5 รายชื่อ): ansion 3, Townhouse 2 เป็นต้น"
    },
    {
      q: "ติดต่อ Apartment 5",
      a: "โทรติดต่อ Apartment 5 ได้ที่เบอร์ 081-234-5678"
    },
    {
      q: "เบอร์โทร Townhouse 3",
      a: "สามารถติดต่อ Townhouse 3 ได้ที่เบอร์ 082-345-6789"
    },
    {
      q: "Apartment 1 location",
      a: "Apartment 1 ตั้งอยู่ที่ ซอย 5 ใกล้ประตูหลัง มจธ."
    },
    {
      q: "ห้องว่าง",
      a: "Room 1 ใน Mansion 8 และ Room 2 ใน House 5 ยังว่างอยู่"
    },
    {
      q: "cctv",
      a: "หอพักที่มี CCTV เช่น(สูงสุด 5 รายชื่อ): Mansion 10, Dorm 3, Apartment 2 เป็นต้น"
    },
    {
      q: "Room 1",
      a: "Room 1 มีในหอพัก เช่น(สูงสุด 5 รายชื่อ): Apartment 1, Dormitory 3, Mansion 5 เป็นต้น"
    },
    {
      q: "สามารถติดต่อกับหอพัก Mansion 3 ได้ยังไง",
      a: "เบอร์ของ Mansion 3 คือ 080-111-2222"
    },
    {
      q: "Mansion 3 มีสัญญาแบบไหน",
      a: "ต้องทำสัญญาอย่างน้อย 12 เดือน"
    },
    {
      q: "ราคาห้องของ Apartment 4 เป็นยังไง",
      a: "Apartment 4 มีราคาห้องระหว่าง 4,500 ถึง 6,000 บาท"
    },
    {
      q: "เข้า Dorm 2 จากทางไหน",
      a: "Dorm 2 เข้าได้จากประตูหลัง"
    },
    {
      q: "Townhouse 9 ใกล้ม.แค่ไหน",
      a: "Townhouse 9 อยู่ห่างมหาวิทยาลัยประมาณ 0.4 กม."
    },
    {
      q: "สิ่งอำนวยความสะดวกของ House 7 มีอะไร",
      a: "House 7 มีสิ่งอำนวยความสะดวก เช่น(สูงสุด 5 รายชื่อ): wifi, cctv, air_conditioner เป็นต้น"
    },
    {
      q: "Apartment 2 เหมาะกับใคร",
      a: "เหมาะกับนักศึกษาหญิง เพราะเป็นหอพักหญิง"
    },
    {
      q: "ความปลอดภัยของ Mansion 10 เป็นยังไง",
      a: "Mansion 10 มีระบบรักษาความปลอดภัย เช่น CCTV"
    }
  ]

  customQA.forEach(({ q, a }) => {
  lines.push(JSON.stringify({
    prompt: `คุณคือแชทบอทแนะนำหอพักในประเทศไทย ห้ามใช้ภาษาจีน และให้ตอบเฉพาะภาษาไทยหรืออังกฤษเท่านั้น\n\nQ: ${q}\nA:`,
    completion: ` ${a}`
  }))
})

  const filePath = path.join(process.cwd(), 'fine-tune-dataset.jsonl')
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8')
  console.log(`✅ บันทึก dataset ที่ ${filePath} แล้ว! ตัวอย่างทั้งหมด: ${lines.length}`)
}

exportToJsonl()
