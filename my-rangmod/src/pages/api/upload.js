import { uploadImage } from '@/lib/cloudinary';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const result = await uploadImage(image);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in upload handler:', error);
    return res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
} 