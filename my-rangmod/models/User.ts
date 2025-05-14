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
}, { timestamps: true });

const User = models.User as mongoose.Model<IUser> || model<IUser>('User', UserSchema);

export default User;
