import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectDB from '@/lib/db/mongoose';
import Subscription from '@/models/Subscription';
import { getUserFromRequest } from '@/lib/utils/serverAuth';

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

    const { planId } = await request.json();

    // Plan details
    const plans: Record<string, { name: string; amount: number; duration: number }> = {
      premium: { name: 'Premium Plan', amount: 29900, duration: 30 }, // Amount in paise (₹299)
      enterprise: { name: 'Enterprise Plan', amount: 199900, duration: 30 }, // ₹1999
    };

    const plan = plans[planId];

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check for existing active subscription
    const existingSubscription = await Subscription.findOne({
      userId: user._id,
      status: 'active',
      endDate: { $gt: new Date() },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { success: false, error: 'You already have an active subscription' },
        { status: 400 }
      );
    }

    // Generate short receipt ID (max 40 chars)
    // Format: rcpt_<random8chars>_<timestamp>
    const shortId = Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now().toString(36);
    const receipt = `rcpt_${shortId}_${timestamp}`.substring(0, 40);

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: 'INR',
      receipt: receipt,
      notes: {
        planId,
        planName: plan.name,
      },
    });

    // Create pending subscription record
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    await Subscription.create({
      userId: user._id,
      plan: planId,
      status: 'pending',
      razorpayOrderId: order.id,
      amount: plan.amount / 100, // Store in rupees
      currency: 'INR',
      startDate,
      endDate,
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        planName: plan.name,
      },
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error?.error?.description || 'Failed to create order' 
      },
      { status: 500 }
    );
  }
}