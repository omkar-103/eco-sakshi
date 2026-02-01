// types/index.ts
export type UserRole = 'citizen' | 'authority' | 'ngo' | 'admin';

export type ReportStatus = 
  | 'pending' 
  | 'verified' 
  | 'under-review' 
  | 'in-progress' 
  | 'resolved' 
  | 'rejected';

export type ReportCategory = 
  | 'air-pollution' 
  | 'water-pollution' 
  | 'waste-dumping' 
  | 'noise-pollution' 
  | 'industrial-violation'
  | 'deforestation'
  | 'other';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface GeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface MediaFile {
  url: string;
  publicId: string;
  type: 'image' | 'video';
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
    capturedAt?: Date;
    gpsData?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface User {
  _id: string;
firebaseUid?: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  isVerified: boolean;
  isActive: boolean;
  subscription?: {
    plan: 'free' | 'premium' | 'enterprise';
    validUntil: Date;
    razorpaySubscriptionId?: string;
  };
  stats?: {
    totalReports: number;
    resolvedReports: number;
    pendingReports: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  _id: string;
  complaintId: string; // Unique readable ID like ECN-2024-XXXXX
  userId: string;
  user?: User;
  title: string;
  description: string;
  category: ReportCategory;
  severity: SeverityLevel;
  status: ReportStatus;
  location: GeoLocation;
  media: MediaFile[];
  assignedTo?: string;
  assignedAuthority?: User;
  verificationNotes?: string;
  authorityResponse?: {
    message: string;
    actionTaken: string;
    media?: MediaFile[];
    respondedAt: Date;
    respondedBy: string;
  };
  statusHistory: {
    status: ReportStatus;
    changedBy: string;
    changedAt: Date;
    notes?: string;
  }[];
  isPublic: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  _id: string;
  userId: string;
  plan: 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  razorpaySubscriptionId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  _id: string;
  userId: string;
  action: string;
  entityType: 'user' | 'report' | 'subscription';
  entityId: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  verifiedReports: number;
  reportsByCategory: Record<ReportCategory, number>;
  reportsBySeverity: Record<SeverityLevel, number>;
  recentReports: Report[];
  trendData: {
    date: string;
    count: number;
  }[];
}