import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema({
  facilities: [String],
  dormitoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dormitory'
  }
}, {
  collection: 'facilities'
});

export default mongoose.models.Facility || mongoose.model("Facility", facilitySchema); 