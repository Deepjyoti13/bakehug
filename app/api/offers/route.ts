import { NextRequest, NextResponse } from 'next/server';
import { getActiveOffers, createOffer } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  try {
    const offers = await getActiveOffers();
    return NextResponse.json(offers);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, discount, item_id, valid_until } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const offer = await createOffer(
      title,
      description || '',
      discount || '',
      item_id ? parseInt(item_id) : null,
      valid_until || null
    );
    return NextResponse.json(offer, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}
