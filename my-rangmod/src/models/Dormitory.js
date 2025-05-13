import mongoose from "mongoose";

const dormitorySchema = new mongoose.Schema({
  name_dormitory: String,
  type_dormitory: String,
  category_dormitory: String,
  alley: String,
  address: String,
  gate_location: String,
  description: String,
  price_range: {
    min: Number,
    max: Number
  },
  electric_price: Number,
  water_price: Number,
  other: Number,
  phone_number: String,
  agreement: String,
  contract_duration: Number,
  num_of_rooms: Number,
  distance_from_university: Number,
  last_updated: Date,
  images: [String]
}, {
  collection: 'dormitories'
});

export default mongoose.models.Dormitory || mongoose.model("Dormitory", dormitorySchema);
