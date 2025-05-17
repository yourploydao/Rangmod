import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;
    
    // Build search query
    const searchQuery = search ? {
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};
    
    // Get total count for pagination
    const total = await User.countDocuments(searchQuery);
    
    // Get users with pagination and search
    const users = await User.find(searchQuery)
      .select('-password -verificationOTP -verificationOTPExpires -resetPasswordOTP -resetPasswordOTPExpires')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
} 