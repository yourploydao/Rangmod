import { connectDB } from '@/lib/mongodb';
import Dormitory from '@/models/Dormitory';
import Facility from '@/models/Facility';
import Room from '@/models/Room';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { id } = req.query;
    const {
      dormitoryName,
      type_dormitory,
      category_dormitory,
      alley,
      address,
      gate_location,
      description,
      electric_price,
      water_price,
      other,
      phone_number,
      agreement,
      contract_duration,
      distance_from_university,
      location,
      facilities,
      photos,
      rooms
    } = req.body;

    // Validate required fields
    if (!dormitoryName || !description || !rooms || !photos) {
      return res.status(400).json({ message: 'Missing required fields' });
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

    // Update dormitory
    const updatedDormitory = await Dormitory.findByIdAndUpdate(
      id,
      {
        name_dormitory: dormitoryName,
        type_dormitory,
        category_dormitory,
        alley,
        address,
        gate_location,
        description,
        electric_price,
        water_price,
        other,
        phone_number,
        agreement,
        contract_duration,
        distance_from_university,
        location,
        images: photos.map(photo => photo.url),
        last_updated: new Date()
      },
      { new: true }
    );

    if (!updatedDormitory) {
      return res.status(404).json({ message: 'Dormitory not found' });
    }

    // Update facilities if provided
    if (facilities) {
      const facilitiesArray = Object.entries(facilities)
        .filter(([_, value]) => value === true)
        .map(([key]) => {
          return key.replace(/([A-Z])/g, '_$1').toLowerCase();
        });

      await Facility.findOneAndUpdate(
        { dormitoryID: id },
        { facilities: facilitiesArray },
        { upsert: true }
      );
    }

    // Update rooms
    if (rooms && rooms.length > 0) {
      // Delete existing rooms
      await Room.deleteMany({ dormitoryID: id });

      // Create new rooms
      const roomPromises = rooms.map(room => {
        return Room.create({
          dormitoryID: id,
          room_type: room.type,
          price: room.price,
          room_size: room.size,
          room_image: room.photos.map(photo => photo.url),
          availability_status: true
        });
      });

      await Promise.all(roomPromises);
    }

    return res.status(200).json({
      message: 'Dormitory updated successfully',
      dormitory: updatedDormitory
    });
  } catch (error) {
    console.error('Error updating dormitory:', error);
    return res.status(500).json({ message: 'Error updating dormitory' });
  }
} 