// src/lib/ai/mongo.ts
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.MONGODB_URI || ''
const dbName = 'Rangmod'
const client = new MongoClient(uri)

export async function getCombinedDormData() {
  await client.connect()
  const db = client.db(dbName)

  const dorms = await db.collection('dormitories').find().toArray()
  const rooms = db.collection('rooms')
  const facilities = db.collection('facilities')

  const combined = await Promise.all(dorms.map(async dorm => {
    const dormId = dorm._id

    const roomDetails = await rooms.find({ dormitoryID: dormId }).toArray()
    const facilityDoc = await facilities.findOne({ dormitoryID: dormId })

    return {
      name: dorm.name_dormitory ?? 'ไม่มีชื่อ',
      full_location: `ซอย ${dorm.alley ?? ''} ${dorm.address ?? ''} (${dorm.gate_location ?? ''})`,
      price_range: dorm.price_range
        ? `${dorm.price_range.min?.$numberInt ?? dorm.price_range.min} - ${dorm.price_range.max?.$numberInt ?? dorm.price_range.max}`
        : 'ไม่ระบุ',
      rooms: roomDetails.map(r => `${r.room_type ?? 'ไม่ระบุ'} ราคา ${r.price ?? 'ไม่ระบุ'} บาท`),
      room_sizes: roomDetails.map(r => r.room_size ?? 'ไม่ระบุ'),
      availability_status: roomDetails.map(r => r.availability_status ?? false),
      facilities: facilityDoc?.facilities ?? [],
      contract_duration: dorm.contract_duration?.$numberInt ?? dorm.contract_duration ?? 'ไม่ระบุ',
      agreement: dorm.agreement ?? 'ไม่ระบุ',
      electric_price: dorm.electric_price?.$numberDouble ?? dorm.electric_price ?? 'ไม่ระบุ',
      water_price: dorm.water_price?.$numberInt ?? dorm.water_price ?? 'ไม่ระบุ',
      other: dorm.other ?? 'ไม่ระบุ',
      distance_from_university: dorm.distance_from_university?.$numberDouble ?? dorm.distance_from_university ?? 'ไม่ระบุ',
      phone_number: dorm.phone_number ?? 'ไม่ระบุ',
      room_type: roomDetails.map(r => r.room_type ?? 'ไม่ระบุ'),
      type_dormitory: dorm.type_dormitory ?? 'ไม่ระบุ',
      category_dormitory: dorm.category_dormitory ?? 'ไม่ระบุ',
      num_of_rooms: dorm.num_of_rooms?.$numberInt ?? dorm.num_of_rooms ?? roomDetails.length
    }
  }))

  return combined
}
