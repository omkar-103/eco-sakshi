import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db/mongoose';
import User from '@/models/User';
import Report from '@/models/Report';
import Subscription from '@/models/Subscription';
import { getUserFromRequest } from '@/lib/utils/serverAuth';

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    // Delete user's reports
    await Report.deleteMany({ userId: user._id });

    // Delete user's subscriptions
    await Subscription.deleteMany({ userId: user._id });

    // Delete user
    await User.findByIdAndDelete(user._id);

    // Clear auth cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}