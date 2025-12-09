import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, eventType, eventData } = body;

    if (!eventType) {
      return NextResponse.json(
        { error: 'Missing eventType' },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO analytics_events (session_id, event_type, event_data)
      VALUES (${sessionId || null}, ${eventType}, ${JSON.stringify(eventData || {})})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Don't fail the request for analytics errors - just log them
    return NextResponse.json({ success: false });
  }
}
