export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDb, adConfigs } from '@/lib/db';
import { and, eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  context: { params: Promise<{ slotName: string }> }
) {
  try {
    const { slotName } = await context.params;
    const db = getDb();

    const result = await db
      .select()
      .from(adConfigs)
      .where(and(eq(adConfigs.slotName, slotName), eq(adConfigs.enabled, true)))
      .limit(1);

    const ad = result[0] ?? null;

    if (!ad || !ad.adCode || ad.adCode.trim() === '') {
      return NextResponse.json({ ad: null });
    }

    return NextResponse.json({ ad: { slotName: ad.slotName, adCode: ad.adCode } });
  } catch (error) {
    console.error('Failed to fetch ad:', error);
    return NextResponse.json({ ad: null }, { status: 200 });
  }
}
