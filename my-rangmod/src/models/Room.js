import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  dormitoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dormitory'
  },
  room_type: String,
  price: Number,
  availability_status: Boolean,
  room_size: Number,
  room_image: [String]
}, {
  collection: 'rooms'
});

export default mongoose.models.Room || mongoose.model("Room", roomSchema); 