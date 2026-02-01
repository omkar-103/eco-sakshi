import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Generate a random API key
export function generateApiKey(): { key: string; secret: string } {
  const prefix = 'esk'; // eco-sakshi-key
  const keyId = crypto.randomBytes(8).toString('hex');
  const secret = crypto.randomBytes(32).toString('hex');
  
  const key = `${prefix}_${keyId}`;
  
  return { key, secret };
}

// Generate full API key string
export function formatApiKey(key: string, secret: string): string {
  return `${key}.${secret}`;
}

// Parse API key from header
export function parseApiKey(apiKey: string): { key: string; secret: string } | null {
  const parts = apiKey.split('.');
  if (parts.length !== 2) return null;
  
  return {
    key: parts[0],
    secret: parts[1],
  };
}

// Hash the secret for storage
export async function hashSecret(secret: string): Promise<string> {
  return bcrypt.hash(secret, 10);
}

// Verify secret
export async function verifySecret(secret: string, hash: string): Promise<boolean> {
  return bcrypt.compare(secret, hash);
}

// API Plans Configuration
export const API_PLANS = {
  free: {
    name: 'Free Trial',
    price: 0,
    duration: 7, // days
    requestsPerMinute: 5,
    requestsPerDay: 50,
    requestsPerMonth: 500,
    permissions: ['reports:read', 'reports:list'],
  },
  basic: {
    name: 'Basic',
    price: 999, // ₹999/month
    duration: 30,
    requestsPerMinute: 30,
    requestsPerDay: 1000,
    requestsPerMonth: 10000,
    permissions: ['reports:read', 'reports:list', 'reports:stats', 'map:read'],
  },
  premium: {
    name: 'Premium',
    price: 2999, // ₹2999/month
    duration: 30,
    requestsPerMinute: 60,
    requestsPerDay: 5000,
    requestsPerMonth: 50000,
    permissions: ['reports:read', 'reports:list', 'reports:stats', 'reports:export', 'map:read', 'analytics:read'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 9999, // ₹9999/month
    duration: 30,
    requestsPerMinute: 120,
    requestsPerDay: 20000,
    requestsPerMonth: 200000,
    permissions: ['reports:read', 'reports:list', 'reports:stats', 'reports:export', 'map:read', 'analytics:read', 'analytics:advanced'],
  },
};

export type ApiPlan = keyof typeof API_PLANS;