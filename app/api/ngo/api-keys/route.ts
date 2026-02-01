import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import ApiKey from '@/models/ApiKey';
import { getUserFromRequest } from '@/lib/utils/serverAuth';
import { 
  generateApiKey, 
  formatApiKey, 
  hashSecret, 
  API_PLANS,
  ApiPlan 
} from '@/lib/utils/apiKey';
import { sendApiKeyEmail } from '@/lib/email/nodemailer';

// GET - List user's API keys
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!['ngo', 'admin'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'API access is only available for NGO accounts' },
        { status: 403 }
      );
    }

    await connectDB();

    const apiKeys = await ApiKey.find({ userId: user._id })
      .select('-secretHash')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: apiKeys,
    });
  } catch (error) {
    console.error('Get API keys error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST - Create free trial API key
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!['ngo', 'admin'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'API access is only available for NGO accounts' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'API key name is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already has a free trial
    const existingFreeKey = await ApiKey.findOne({
      userId: user._id,
      plan: 'free',
    });

    if (existingFreeKey) {
      return NextResponse.json(
        { success: false, error: 'You already have a free trial API key. Upgrade to create more keys.' },
        { status: 400 }
      );
    }

    // Generate API key
    const { key, secret } = generateApiKey();
    const secretHash = await hashSecret(secret);
    const fullKey = formatApiKey(key, secret);
    
    const plan = API_PLANS.free;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.duration);

    // Create API key
    const apiKey = await ApiKey.create({
      userId: user._id,
      name,
      key,
      secretHash,
      plan: 'free',
      status: 'active',
      permissions: plan.permissions,
      rateLimit: {
        requestsPerMinute: plan.requestsPerMinute,
        requestsPerDay: plan.requestsPerDay,
        requestsPerMonth: plan.requestsPerMonth,
      },
      expiresAt,
    });

    // Send email with API key
    try {
      await sendApiKeyEmail(user as any, {
        keyName: name,
        apiKey: fullKey,
        plan: 'Free Trial',
        expiresAt,
        limits: {
          perMinute: plan.requestsPerMinute,
          perDay: plan.requestsPerDay,
          perMonth: plan.requestsPerMonth,
        },
      });
    } catch (emailError) {
      console.error('Failed to send API key email:', emailError);
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: apiKey._id,
        name: apiKey.name,
        key: apiKey.key,
        fullKey, // Only returned once at creation!
        plan: apiKey.plan,
        permissions: apiKey.permissions,
        rateLimit: apiKey.rateLimit,
        expiresAt: apiKey.expiresAt,
      },
      message: 'API key created successfully. Save the full key - it won\'t be shown again!',
    });
  } catch (error) {
    console.error('Create API key error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

// DELETE - Revoke API key
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('id');

    if (!keyId) {
      return NextResponse.json(
        { success: false, error: 'API key ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const apiKey = await ApiKey.findOneAndUpdate(
      { _id: keyId, userId: user._id },
      { status: 'revoked' },
      { new: true }
    );

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'API key revoked successfully',
    });
  } catch (error) {
    console.error('Revoke API key error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revoke API key' },
      { status: 500 }
    );
  }
}