import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectDB from '@/lib/db/mongoose';
import ApiKey from '@/models/ApiKey';
import { getUserFromRequest } from '@/lib/utils/serverAuth';
import { API_PLANS, ApiPlan } from '@/lib/utils/apiKey';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

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

    const { plan, keyName } = await request.json();

    if (!plan || !['basic', 'premium', 'enterprise'].includes(plan)) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    if (!keyName) {
      return NextResponse.json(
        { success: false, error: 'API key name is required' },
        { status: 400 }
      );
    }

    const planConfig = API_PLANS[plan as ApiPlan];
    
    // Generate short receipt ID
    const shortId = Math.random().toString(36).substring(2, 10);
    const receipt = `api_${shortId}`.substring(0, 40);

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: planConfig.price * 100, // Convert to paise
      currency: 'INR',
      receipt,
      notes: {
        userId: user._id.toString(),
        plan,
        keyName,
        type: 'api_key_purchase',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        plan: planConfig.name,
        keyName,
      },
    });
  } catch (error: any) {
    console.error('Create API order error:', error);
    return NextResponse.json(
      { success: false, error: error?.error?.description || 'Failed to create order' },
      { status: 500 }
    );
  }
}