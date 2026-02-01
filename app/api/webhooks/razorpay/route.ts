import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db/mongoose';
import Subscription from '@/models/Subscription';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    await connectDB();

    switch (event.event) {
      case 'payment.captured': {
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;

        // Find subscription by order ID
        const subscription = await Subscription.findOne({
          razorpayOrderId: orderId,
        });

        if (subscription && subscription.status === 'pending') {
          subscription.status = 'active';
          subscription.razorpayPaymentId = payment.id;
          await subscription.save();

          // Update user
          await User.findByIdAndUpdate(subscription.userId, {
            'subscription.plan': subscription.plan,
            'subscription.validUntil': subscription.endDate,
          });
        }
        break;
      }

      case 'payment.failed': {
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;

        // Mark subscription as failed
        await Subscription.findOneAndUpdate(
          { razorpayOrderId: orderId },
          { status: 'expired' }
        );
        break;
      }

      case 'refund.created': {
        const refund = event.payload.refund.entity;
        const paymentId = refund.payment_id;

        // Find and cancel subscription
        const subscription = await Subscription.findOne({
          razorpayPaymentId: paymentId,
        });

        if (subscription) {
          subscription.status = 'cancelled';
          subscription.cancelledAt = new Date();
          await subscription.save();

          // Revert user to free plan
          await User.findByIdAndUpdate(subscription.userId, {
            'subscription.plan': 'free',
            'subscription.validUntil': null,
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}