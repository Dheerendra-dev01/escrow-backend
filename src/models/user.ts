import mongoose, { HydratedDocument, Model } from 'mongoose';

export type UserRole = 'client' | 'freelancer' | 'both';

export interface IUser {
  walletAddress: string;
  name?: string;
  email?: string;
  role: UserRole;
  profileData?: unknown;
  isDeleted?: boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },

     isDeleted: {
      type: Boolean,
      default: false
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true
    },
    role: {
      type: String,
      required: true,
      enum: ['client', 'freelancer', 'both'],
      default: 'client',
    },
    profileData: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

export type UserDocument = HydratedDocument<IUser>;

export const User: Model<IUser> = mongoose.models.User ?? mongoose.model<IUser>('User', userSchema);