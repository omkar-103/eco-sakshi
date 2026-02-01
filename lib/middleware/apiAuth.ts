import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import ApiKey from '@/models/ApiKey';
import { parseApiKey, verifySecret } from '@/lib/utils/apiKey';

interface ApiAuthResult {
  success: boolean;
  error?: string;
  statusCode?: number;
  apiKey?: any;
  userId?: string;
}

export async function validateApiKey(request: NextRequest): Promise<ApiAuthResult> {
  try {
    // Get API key from header
    const authHeader = request.headers.get('x-api-key') || request.headers.get('authorization');
    
    if (!authHeader) {
      return {
        success: false,
        error: 'API key is required. Provide it in x-api-key header.',
        statusCode: 401,
      };
    }

    // Remove 'Bearer ' if present
    const apiKeyString = authHeader.replace('Bearer ', '').trim();
    
    // Parse the key
    const parsed = parseApiKey(apiKeyString);
    if (!parsed) {
      return {
        success: false,
        error: 'Invalid API key format',
        statusCode: 401,
      };
    }

    await connectDB();

    // Find the API key
    const apiKeyDoc = await ApiKey.findOne({ 
      key: parsed.key,
      status: 'active',
    }).populate('userId', 'name email role');

    if (!apiKeyDoc) {
      return {
        success: false,
        error: 'Invalid or inactive API key',
        statusCode: 401,
      };
    }

    // Verify secret
    const isValidSecret = await verifySecret(parsed.secret, apiKeyDoc.secretHash);
    if (!isValidSecret) {
      return {
        success: false,
        error: 'Invalid API key',
        statusCode: 401,
      };
    }

    // Check expiration
    if (apiKeyDoc.expiresAt && new Date() > apiKeyDoc.expiresAt) {
      await ApiKey.findByIdAndUpdate(apiKeyDoc._id, { status: 'expired' });
      return {
        success: false,
        error: 'API key has expired',
        statusCode: 401,
      };
    }

    // Check rate limits
    const now = new Date();
    const usage = apiKeyDoc.usage;
    
    // Reset counters if needed
    const updates: any = {};
    
    // Reset minute counter
    if (!usage.lastResetMinute || (now.getTime() - usage.lastResetMinute.getTime()) > 60000) {
      updates['usage.requestsThisMinute'] = 0;
      updates['usage.lastResetMinute'] = now;
    }
    
    // Reset daily counter
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (!usage.lastResetDay || usage.lastResetDay < todayStart) {
      updates['usage.requestsToday'] = 0;
      updates['usage.lastResetDay'] = now;
    }
    
    // Reset monthly counter
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    if (!usage.lastResetMonth || usage.lastResetMonth < monthStart) {
      updates['usage.requestsThisMonth'] = 0;
      updates['usage.lastResetMonth'] = now;
    }

    // Apply resets if any
    if (Object.keys(updates).length > 0) {
      await ApiKey.findByIdAndUpdate(apiKeyDoc._id, { $set: updates });
      // Refresh the document
      Object.assign(apiKeyDoc.usage, {
        requestsThisMinute: updates['usage.requestsThisMinute'] ?? usage.requestsThisMinute,
        requestsToday: updates['usage.requestsToday'] ?? usage.requestsToday,
        requestsThisMonth: updates['usage.requestsThisMonth'] ?? usage.requestsThisMonth,
      });
    }

    // Check rate limits
    if (apiKeyDoc.usage.requestsThisMinute >= apiKeyDoc.rateLimit.requestsPerMinute) {
      return {
        success: false,
        error: 'Rate limit exceeded: Too many requests per minute',
        statusCode: 429,
      };
    }

    if (apiKeyDoc.usage.requestsToday >= apiKeyDoc.rateLimit.requestsPerDay) {
      return {
        success: false,
        error: 'Rate limit exceeded: Daily limit reached',
        statusCode: 429,
      };
    }

    if (apiKeyDoc.usage.requestsThisMonth >= apiKeyDoc.rateLimit.requestsPerMonth) {
      return {
        success: false,
        error: 'Rate limit exceeded: Monthly limit reached',
        statusCode: 429,
      };
    }

    // Increment usage counters
    await ApiKey.findByIdAndUpdate(apiKeyDoc._id, {
      $inc: {
        'usage.totalRequests': 1,
        'usage.requestsThisMinute': 1,
        'usage.requestsToday': 1,
        'usage.requestsThisMonth': 1,
      },
      $set: {
        'usage.lastRequestAt': now,
      },
    });

    return {
      success: true,
      apiKey: apiKeyDoc,
      userId: apiKeyDoc.userId._id?.toString(),
    };
  } catch (error) {
    console.error('API auth error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      statusCode: 500,
    };
  }
}

// Helper to check permissions
export function hasPermission(apiKey: any, permission: string): boolean {
  return apiKey.permissions.includes(permission);
}