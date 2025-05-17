import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    // ดึง id จาก URL path
    const url = new URL(req.url);
    // สมมติ path /api/users/:id
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 1];

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    // ดึง id จาก URL path
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 1];

    const { role } = await req.json();

    if (!['user', 'admin', 'owner'].includes(role)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      id,
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
