import mongoose, { models, model, Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  role: 'user' | 'admin' | 'owner';
  isVerified: boolean;
  resetPasswordOTP: string | null;
  resetPasswordOTPExpires: Date | null;
  verificationOTP: string | null;
  verificationOTPExpires: Date | null;
  profile_picture: string;
  dormitories: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'owner'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  resetPasswordOTP: { type: String, default: null },
  resetPasswordOTPExpires: { type: Date, default: null },
  verificationOTP: { type: String, default: null },
  verificationOTPExpires: { type: Date, default: null },
  profile_picture: { 
    type: String, 
    default: 'https://res.cloudinary.com/disbsxrab/image/upload/v1747231770/blank-profile-picture-973460_1280_l8vnyk.png'
  },
  dormitories: [{
    type: Schema.Types.ObjectId,
    ref: 'Dormitory',
    default: []
  }]
}, { timestamps: true });

const User = models.User as mongoose.Model<IUser> || model<IUser>('User', UserSchema);

export default User;
