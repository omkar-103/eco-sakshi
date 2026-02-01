import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db/mongoose';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/utils/serverAuth';
import { sendSubscriptionEmail } from '@/lib/email/nodemailer';

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

    // Find and update subscription
    const subscription = await Subscription.findOne({
      razorpayOrderId: razorpay_order_id,
      userId: user._id,
      status: 'pending',
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Update subscription status
    subscription.status = 'active';
    subscription.razorpayPaymentId = razorpay_payment_id;
    await subscription.save();

    // Update user subscription
    await User.findByIdAndUpdate(user._id, {
      'subscription.plan': subscription.plan,
      'subscription.validUntil': subscription.endDate,
      'subscription.razorpaySubscriptionId': subscription._id,
    });

    // Send confirmation email
    try {
      await sendSubscriptionEmail(
        { ...user, _id: user._id.toString() } as any,
        subscription.plan,
        subscription.endDate
      );
    } catch (emailError) {
      console.error('Failed to send subscription email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription activated successfully',
      data: {
        plan: subscription.plan,
        validUntil: subscription.endDate,
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}