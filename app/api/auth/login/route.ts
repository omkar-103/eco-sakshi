import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyFirebaseToken } from '@/lib/firebase/admin';
import connectDB from '@/lib/db/mongoose';
import User from '@/models/User';
import { generateToken } from '@/lib/utils/auth';
import { sendWelcomeEmail } from '@/lib/email/nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: 'ID token is required' },
        { status: 400 }
      );
    }

    // Verify Firebase token
    const firebaseResult = await verifyFirebaseToken(idToken);

    if (!firebaseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const { uid, email, name, picture } = firebaseResult;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find or create user
    let user = await User.findOne({ firebaseUid: uid });
    let isNewUser = false;

    if (!user) {
      // Create new user
      isNewUser = true;
      user = await User.create({
        firebaseUid: uid,
        email,
        name: name || email.split('@')[0],
        avatar: picture || undefined,
        role: 'citizen', // Default role
        isVerified: true, // Google accounts are pre-verified
        isActive: true,
        subscription: {
          plan: 'free',
        },
        stats: {
          totalReports: 0,
          resolvedReports: 0,
          pendingReports: 0,
        },
      });

      // Send welcome email for new users
      try {
        await sendWelcomeEmail(user.toObject());
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail login if email fails
      }
    } else {
      // Update last login and avatar if changed
      user.lastLoginAt = new Date();
      if (picture && picture !== user.avatar) {
        user.avatar = picture;
      }
      if (name && name !== user.name) {
        user.name = name;
      }
      await user.save();
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // Prepare user response (exclude sensitive fields)
    const userResponse = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
      subscription: user.subscription,
      stats: user.stats,
      createdAt: user.createdAt,
    };

    return NextResponse.json({
      success: true,
      user: userResponse,
      isNewUser,
      message: isNewUser ? 'Account created successfully' : 'Logged in successfully',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}