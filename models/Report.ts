// models/Report.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  complaintId: string;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'verified' | 'under-review' | 'in-progress' | 'resolved' | 'rejected';
  location: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  media: Array<{
    url: string;
    publicId: string;
    type: 'image' | 'video';
    metadata?: Record<string, unknown>;
  }>;
  statusHistory: Array<{
    status: string;
    changedBy: mongoose.Types.ObjectId;
    changedAt: Date;
    notes?: string;
  }>;
  assignedTo?: mongoose.Types.ObjectId;
  verificationNotes?: string;
  authorityResponse?: {
    message: string;
    actionTaken: string;
    media?: Array<{ url: string; type: string }>;
    respondedAt: Date;
    respondedBy: mongoose.Types.ObjectId;
  };
  isPublic: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'air-pollution',
        'water-pollution',
        'waste-dumping',
        'noise-pollution',
        'industrial-violation',
        'deforestation',
        'wildlife',
        'other',
      ],
      index: true,
    },
    severity: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'verified', 'under-review', 'in-progress', 'resolved', 'rejected'],
      default: 'pending',
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    media: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        type: { type: String, enum: ['image', 'video'], required: true },
        metadata: Schema.Types.Mixed,
      },
    ],
    statusHistory: [
      {
        status: { type: String, required: true },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        changedAt: { type: Date, default: Date.now },
        notes: String,
      },
    ],
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    verificationNotes: String,
    authorityResponse: {
      message: String,
      actionTaken: String,
      media: [
        {
          url: String,
          type: String,
        },
      ],
      respondedAt: Date,
      respondedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);

// Indexes
ReportSchema.index({ location: '2dsphere' });
ReportSchema.index({ createdAt: -1 });
ReportSchema.index({ userId: 1, status: 1 });
ReportSchema.index({ category: 1, severity: 1 });

// Delete existing model if it exists (for hot reloading)
const Report = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);

export default Report;