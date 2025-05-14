import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/config/db';
import { sendEmail } from '@/config/mailer';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update verification OTP and expiry time
    user.verificationOTP = verificationOTP;
    user.verificationOTPExpires = verificationOTPExpires;
    await user.save();

    // Send verification OTP email
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      text: `Your verification OTP is: ${verificationOTP}`,
    });

    return NextResponse.json({ message: 'Verification OTP sent to your email' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
} 