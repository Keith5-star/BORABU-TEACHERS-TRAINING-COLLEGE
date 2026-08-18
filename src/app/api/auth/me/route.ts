import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Internal server error during session check.' },
      { status: 500 }
    );
  }
}
