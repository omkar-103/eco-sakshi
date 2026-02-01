import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  razorpaySubscriptionId?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  amount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ['premium', 'enterprise'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'pending'],
      default: 'pending',
    },
    razorpaySubscriptionId: String,
    razorpayPaymentId: String,
    razorpayOrderId: String,
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

SubscriptionSchema.index({ status: 1, endDate: 1 });

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;