// models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'citizen' | 'authority' | 'ngo' | 'admin';
export type AuthProvider = 'google' | 'email';
export type SubscriptionPlan = 'free' | 'premium' | 'enterprise';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firebaseUid?: string;
  email: string;
  password?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  authProvider: AuthProvider;
  isVerified: boolean;
  isActive: boolean;
  subscription: {
    plan: SubscriptionPlan;
    validUntil?: Date;
    razorpaySubscriptionId?: string;
  };
  stats: {
    totalReports: number;
    resolvedReports: number;
    pendingReports: number;
  };
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: {
      type: String,
      sparse: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      select: false, // Don't include password by default in queries
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ['citizen', 'authority', 'ngo', 'admin'],
      default: 'citizen',
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    authProvider: {
      type: String,
      enum: ['google', 'email'],
      default: 'google',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'premium', 'enterprise'],
        default: 'free',
      },
      validUntil: Date,
      razorpaySubscriptionId: String,
    },
    stats: {
      totalReports: { type: Number, default: 0 },
      resolvedReports: { type: Number, default: 0 },
      pendingReports: { type: Number, default: 0 },
    },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
UserSchema.index({ role: 1 });
UserSchema.index({ 'subscription.plan': 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ authProvider: 1 });

// Delete existing model if exists (for hot reloading)
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;