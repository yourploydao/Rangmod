import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

// Delete user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const user = await User.findByIdAndDelete(params.id);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}

// Update user role
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { role } = await req.json();
    
    // Validate role
    if (!['user', 'admin', 'owner'].includes(role)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }
    
    const user = await User.findByIdAndUpdate(
      params.id,
      { role },
      { new: true }
    ).select('-password -verificationOTP -verificationOTPExpires -resetPasswordOTP -resetPasswordOTPExpires');
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ message: 'Error updating user role' }, { status: 500 });
  }
} 