export const REPORT_CATEGORIES = [
  { value: 'air-pollution', label: 'Air Pollution', icon: 'Wind' },
  { value: 'water-pollution', label: 'Water Pollution', icon: 'Droplets' },
  { value: 'waste-dumping', label: 'Waste Dumping', icon: 'Trash2' },
  { value: 'noise-pollution', label: 'Noise Pollution', icon: 'Volume2' },
  { value: 'industrial-violation', label: 'Industrial Violation', icon: 'Factory' },
  { value: 'deforestation', label: 'Deforestation', icon: 'TreeDeciduous' },
  { value: 'other', label: 'Other', icon: 'AlertCircle' },
] as const;

export const SEVERITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'green' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' },
] as const;

export const REPORT_STATUSES = [
  { value: 'pending', label: 'Pending Review' },
  { value: 'verified', label: 'Verified' },
  { value: 'under-review', label: 'Under Review' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
] as const;

export const USER_ROLES = [
  { value: 'citizen', label: 'Citizen', description: 'Report environmental issues' },
  { value: 'authority', label: 'Authority', description: 'Review and respond to reports' },
  { value: 'ngo', label: 'NGO', description: 'Access data and analytics' },
  { value: 'admin', label: 'Administrator', description: 'Full system access' },
] as const;

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'INR',
    features: [
      'Submit up to 5 reports/month',
      'Track complaint status',
      'Basic map view',
      'Email notifications',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 299,
    currency: 'INR',
    features: [
      'Unlimited reports',
      'Priority review',
      'Advanced analytics',
      'Export reports',
      'Priority support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise (NGO)',
    price: 1999,
    currency: 'INR',
    features: [
      'Full data access',
      'API access',
      'Custom reports',
      'Bulk data export',
      'Dedicated support',
      'White-label options',
    ],
  },
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
export const MAX_FILES_PER_REPORT = 5;

export const MAP_DEFAULT_CENTER: [number, number] = [20.5937, 78.9629]; // India center
export const MAP_DEFAULT_ZOOM = 5;