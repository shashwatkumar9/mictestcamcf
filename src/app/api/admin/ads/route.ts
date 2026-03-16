export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthToken } from '@/lib/admin/auth';
import { getDb, adConfigs } from '@/lib/db';
import { asc, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { AD_SLOT_NAMES } from '@/config/ads';

// GET all ad configurations
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyAuthToken(token);
    if (!user || user.role === 'viewer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const db = getDb();
    const ads = await db.select().from(adConfigs).orderBy(asc(adConfigs.slotName));

    return NextResponse.json({ ads });
  } catch (error) {
    console.error('Failed to fetch ads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST to upsert ad configuration
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyAuthToken(token);
    if (!user || !['admin', 'editor'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { slotName, adCode, enabled } = await request.json();

    const validSlotNames = Object.values(AD_SLOT_NAMES);
    if (!validSlotNames.includes(slotName)) {
      return NextResponse.json({ error: 'Invalid slot name' }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();
    const existing = await db.select().from(adConfigs).where(eq(adConfigs.slotName, slotName)).limit(1);

    let ad;
    if (existing.length > 0) {
      const [updated] = await db.update(adConfigs).set({ adCode, enabled, updatedAt: now }).where(eq(adConfigs.slotName, slotName)).returning();
      ad = updated;
    } else {
      const [created] = await db.insert(adConfigs).values({ id: uuidv4(), slotName, adCode, enabled, createdAt: now, updatedAt: now }).returning();
      ad = created;
    }

    return NextResponse.json({ ad });
  } catch (error) {
    console.error('Failed to update ad:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE an ad configuration
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyAuthToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const { slotName } = await request.json();
    const db = getDb();
    await db.delete(adConfigs).where(eq(adConfigs.slotName, slotName));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete ad:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
