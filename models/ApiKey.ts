import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IApiKey extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  key: string;
  secretHash: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'expired' | 'revoked';
  permissions: string[];
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
    requestsPerMonth: number;
  };
  usage: {
    totalRequests: number;
    requestsThisMinute: number;
    requestsToday: number;
    requestsThisMonth: number;
    lastRequestAt?: Date;
    lastResetMinute?: Date;
    lastResetDay?: Date;
    lastResetMonth?: Date;
  };
  allowedIPs?: string[];
  allowedDomains?: string[];
  expiresAt?: Date;
  paymentId?: string;
  subscriptionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    secretHash: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired', 'revoked'],
      default: 'active',
    },
    permissions: [{
      type: String,
      enum: [
        'reports:read',
        'reports:list',
        'reports:stats',
        'reports:export',
        'map:read',
        'analytics:read',
        'analytics:advanced',
      ],
    }],
    rateLimit: {
      requestsPerMinute: { type: Number, default: 10 },
      requestsPerDay: { type: Number, default: 100 },
      requestsPerMonth: { type: Number, default: 1000 },
    },
    usage: {
      totalRequests: { type: Number, default: 0 },
      requestsThisMinute: { type: Number, default: 0 },
      requestsToday: { type: Number, default: 0 },
      requestsThisMonth: { type: Number, default: 0 },
      lastRequestAt: Date,
      lastResetMinute: Date,
      lastResetDay: Date,
      lastResetMonth: Date,
    },
    allowedIPs: [String],
    allowedDomains: [String],
    expiresAt: Date,
    paymentId: String,
    subscriptionId: String,
    metadata: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

// Indexes
ApiKeySchema.index({ key: 1, status: 1 });
ApiKeySchema.index({ userId: 1, status: 1 });
ApiKeySchema.index({ expiresAt: 1 });

const ApiKey: Model<IApiKey> = mongoose.models.ApiKey || mongoose.model<IApiKey>('ApiKey', ApiKeySchema);

export default ApiKey;