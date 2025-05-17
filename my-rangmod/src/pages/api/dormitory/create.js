import { connectDB } from '@/lib/mongodb';
import Dormitory from '@/models/Dormitory';
import Room from '@/models/Room';
import Facility from '@/models/Facility';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const {
      dormitoryName,
      description,
      facilities,
      rooms,
      photos,
      type_dormitory,
      category_dormitory,
      alley,
      address,
      electric_price,
      water_price,
      other,
      phone_number,
      agreement,
      distance_from_university,
      location,
      contract_duration,
      gate_location
    } = req.body;

    // Validate required fields
    if (!dormitoryName || !description || !rooms || !photos) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate type_dormitory
    if (!type_dormitory || !['Apartment', 'Mansion', 'Dormitory', 'Condominium', 'House', 'Townhouse'].includes(type_dormitory)) {
      return res.status(400).json({ message: 'Invalid dormitory type' });
    }

    // Validate contract duration
    if (![3, 6, 12].includes(Number(contract_duration))) {
      return res.status(400).json({ message: 'Contract duration must be 3, 6, or 12 months' });
    }

    // Validate gate location
    if (!['Front Gate', 'Back Gate'].includes(gate_location)) {
      return res.status(400).json({ message: 'Gate location must be either Front Gate or Back Gate' });
    }

    // Validate minimum photos requirement
    if (photos.length < 5) {
      return res.status(400).json({ message: 'At least 5 photos are required' });
    }

    // Validate minimum rooms requirement
    if (rooms.length < 1) {
      return res.status(400).json({ message: 'At least 1 room is required' });
    }

    // Calculate price range from rooms
    const prices = rooms.map(room => Number(room.price));
    const price_range = {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };

    // Create dormitory
    const dormitory = await Dormitory.create({
      name_dormitory: dormitoryName,
      type_dormitory: type_dormitory,
      category_dormitory: category_dormitory || 'Mixed',
      alley: alley || '',
      address: address,
      description,
      price_range,
      electric_price: Number(electric_price) || 0,
      water_price: Number(water_price) || 0,
      other: Number(other) || 0,
      phone_number: phone_number || '',
      agreement: agreement || '',
      num_of_rooms: rooms.length,
      distance_from_university: Number(distance_from_university) || 0,
      location,
      contract_duration: Number(contract_duration),
      gate_location,
      last_updated: new Date().toISOString(),
      images: photos.map(photo => photo.url)
    });

    // Create rooms
    const roomPromises = rooms.map(room => 
      Room.create({
        dormitoryID: dormitory._id,
        room_type: room.type,
        price: Number(room.price),
        availability_status: true,
        room_size: Number(room.size),
        room_image: room.photos.map(photo => photo.url)
      })
    );

    // Create facilities
    const facilityPromises = Facility.create({
      dormitoryID: dormitory._id,
      facilities: Object.entries(facilities)
        .filter(([_, value]) => value)
        .map(([key]) => key)
    });

    // Wait for all operations to complete
    await Promise.all([...roomPromises, facilityPromises]);

    return res.status(201).json({
      message: 'Dormitory created successfully',
      dormitoryId: dormitory._id
    });

  } catch (error) {
    console.error('Error creating dormitory:', error);
    return res.status(500).json({ message: 'Error creating dormitory', error: error.message });
  }
} 