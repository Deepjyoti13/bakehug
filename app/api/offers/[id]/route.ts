import { NextRequest, NextResponse } from 'next/server';
import { updateOffer, deleteOffer } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, discount, item_id, is_active, valid_until } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const offer = await updateOffer(
      parseInt(id),
      title,
      description || '',
      discount || '',
      item_id ? parseInt(item_id) : null,
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      valid_until || null
    );
    return NextResponse.json(offer);
  } catch {
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await deleteOffer(parseInt(id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}
