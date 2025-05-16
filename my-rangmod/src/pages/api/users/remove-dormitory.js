import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { userId, dormitoryId } = req.body;

    if (!userId || !dormitoryId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove dormitory from user's dormitories array
    user.dormitories = user.dormitories.filter(
      dormId => dormId.toString() !== dormitoryId
    );
    await user.save();

    // Return updated user data
    const updatedUser = await User.findById(userId).lean();
    updatedUser._id = updatedUser._id.toString();
    updatedUser.dormitories = updatedUser.dormitories.map(d => d.toString());

    res.status(200).json({ 
      user: updatedUser
    });
  } catch (error) {
    console.error('Error removing dormitory:', error);
    res.status(500).json({ message: 'Error removing dormitory' });
  }
} 