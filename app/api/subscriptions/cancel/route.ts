import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/utils/serverAuth';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const subscription = await Subscription.findOne({
      userId: user._id,
      status: 'active',
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Mark as cancelled (still active until end date)
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    await subscription.save();

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled. You can continue using premium features until the end of your billing period.',
      data: {
        validUntil: subscription.endDate,
      },
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}