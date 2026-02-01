import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
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

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      keyName,
    } = await request.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate API key
    const { key, secret } = generateApiKey();
    const secretHash = await hashSecret(secret);
    const fullKey = formatApiKey(key, secret);
    
    const planConfig = API_PLANS[plan as ApiPlan];
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + planConfig.duration);

    // Create API key
    const apiKey = await ApiKey.create({
      userId: user._id,
      name: keyName,
      key,
      secretHash,
      plan,
      status: 'active',
      permissions: planConfig.permissions,
      rateLimit: {
        requestsPerMinute: planConfig.requestsPerMinute,
        requestsPerDay: planConfig.requestsPerDay,
        requestsPerMonth: planConfig.requestsPerMonth,
      },
      expiresAt,
      paymentId: razorpay_payment_id,
    });

    // Send email with API key
    try {
      await sendApiKeyEmail(user as any, {
        keyName,
        apiKey: fullKey,
        plan: planConfig.name,
        expiresAt,
        limits: {
          perMinute: planConfig.requestsPerMinute,
          perDay: planConfig.requestsPerDay,
          perMonth: planConfig.requestsPerMonth,
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
        fullKey, // Only returned once!
        plan: apiKey.plan,
        permissions: apiKey.permissions,
        rateLimit: apiKey.rateLimit,
        expiresAt: apiKey.expiresAt,
      },
      message: 'Payment successful! API key created. Save the full key - it won\'t be shown again!',
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}