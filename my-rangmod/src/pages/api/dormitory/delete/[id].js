import { connectDB } from '@/lib/mongodb';
import Dormitory from '@/models/Dormitory';
import Facility from '@/models/Facility';
import Room from '@/models/Room';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { id } = req.query;

    // Delete the dormitory
    const deletedDormitory = await Dormitory.findByIdAndDelete(id);
    
    if (!deletedDormitory) {
      return res.status(404).json({ message: 'Dormitory not found' });
    }

    // Delete associated facilities
    await Facility.deleteMany({ dormitoryID: id });

    // Delete associated rooms
    await Room.deleteMany({ dormitoryID: id });

    return res.status(200).json({ 
      message: 'Dormitory and all related data deleted successfully',
      deletedData: {
        dormitory: deletedDormitory._id,
        facilities: true,
        rooms: true
      }
    });
  } catch (error) {
    console.error('Error deleting dormitory and related data:', error);
    return res.status(500).json({ message: 'Error deleting dormitory and related data' });
  }
} 