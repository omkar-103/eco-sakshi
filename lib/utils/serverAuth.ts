// lib/utils/serverAuth.ts
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/mongoose';
import User, { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<IUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    await connectDB();
    const user = await User.findById(payload.userId).lean();

    if (!user || !user.isActive) {
      return null;
    }

    return user as IUser;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export async function getUserFromRequest(request: NextRequest): Promise<IUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    await connectDB();
    const user = await User.findById(payload.userId).lean();

    if (!user || !user.isActive) {
      return null;
    }

    return user as IUser;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export async function requireAuth(
  request: NextRequest,
  roles?: string[]
): Promise<{ authorized: boolean; user?: IUser; error?: string; status?: number }> {
  const user = await getUserFromRequest(request);

  if (!user) {
    return { authorized: false, error: 'Not authenticated', status: 401 };
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return { authorized: false, error: 'Insufficient permissions', status: 403 };
  }

  return { authorized: true, user };
}