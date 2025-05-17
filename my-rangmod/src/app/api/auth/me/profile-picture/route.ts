import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import User from '@/models/User';
import { connectDB } from '@/lib/mongodb';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function PUT(req: Request) {
  try {
    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary configuration missing:', {
        cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
        api_key: !!process.env.CLOUDINARY_API_KEY,
        api_secret: !!process.env.CLOUDINARY_API_SECRET
      });
      return NextResponse.json(
        { message: 'Server configuration error: Cloudinary credentials missing' },
        { status: 500 }
      );
    }

    await connectDB();

    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as { id: string };

    if (!decoded?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('profile_picture') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log('Received file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    try {
      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      console.log('File converted to buffer, size:', buffer.length);

      // Upload to Cloudinary
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'profile_pictures',
            resource_type: 'auto',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
            max_bytes: 5 * 1024 * 1024 // 5MB
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              console.log('Cloudinary upload successful:', result);
              resolve(result);
            }
          }
        );

        uploadStream.on('error', (error) => {
          console.error('Upload stream error:', error);
          reject(error);
        });

        uploadStream.end(buffer);
      });

      const { secure_url } = uploadResponse as { secure_url: string };

      console.log('Updating user profile picture:', {
        userId: decoded.id,
        newPictureUrl: secure_url
      });

      // Update user's profile picture
      const updatedUser = await User.findByIdAndUpdate(
        decoded.id,
        { profile_picture: secure_url },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        console.error('User not found after upload:', decoded.id);
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      console.log('Profile picture updated successfully');
      return NextResponse.json(updatedUser);
    } catch (uploadError) {
      console.error('Error during file upload:', uploadError);
      return NextResponse.json(
        { message: 'Failed to upload image: ' + (uploadError as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating profile picture:', error);
    return NextResponse.json(
      { message: 'Something went wrong: ' + (error as Error).message },
      { status: 500 }
    );
  }
} 