import { NextResponse } from 'next/server';
import { authMiddleware, AuthenticatedRequest } from '@/lib/middleware';
import { supabase, formatUserResponse } from '@/lib/db';

async function handler(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: formatUserResponse(user),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = authMiddleware(handler);
