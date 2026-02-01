import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Subscription from '@/models/Subscription';
import { getUserFromRequest } from '@/lib/utils/serverAuth';

export async function GET(request: NextRequest) {
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
      endDate: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: subscription || null,
      currentPlan: user.subscription?.plan || 'free',
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}