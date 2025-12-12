import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, email } = body as { sessionId?: string; email?: string };

    // Validate required fields
    if (!sessionId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Update the submission with the email
    const result = await sql`
      UPDATE submissions
      SET email = ${email}
      WHERE session_id = ${sessionId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Track email submission event
    await sql`
      INSERT INTO analytics_events (session_id, event_type, event_data)
      VALUES (${sessionId}, 'email_submitted', ${JSON.stringify({ email })})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save email error:', error);
    return NextResponse.json(
      { error: 'Failed to save email' },
      { status: 500 }
    );
  }
}
