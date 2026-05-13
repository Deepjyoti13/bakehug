import { NextRequest, NextResponse } from 'next/server';
import { updateItem, deleteItem } from '@/lib/db';
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
    const { category_id, name, description, price, image_path, is_available } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const item = await updateItem(
      parseInt(id),
      category_id ? parseInt(category_id) : null,
      name,
      description || '',
      price !== undefined && price !== null ? parseFloat(price) : null,
      image_path || null,
      is_available !== undefined ? (is_available ? 1 : 0) : 1
    );
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
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
    await deleteItem(parseInt(id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
