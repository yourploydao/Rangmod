import { connectDB } from '@/lib/mongodb';
import Dormitory from '@/models/Dormitory';

export async function GET() {
  await connectDB(); // connects to 'Rangmod'
  const dorms = await Dormitory.find({});
  return Response.json(dorms);
}
