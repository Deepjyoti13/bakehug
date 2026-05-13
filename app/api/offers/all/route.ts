import { NextResponse } from 'next/server';
import { getAllOffers } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const offers = await getAllOffers();
    return NextResponse.json(offers);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}
