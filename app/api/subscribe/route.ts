import { NextResponse } from 'next/server';

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const GROUP_ID = process.env.MAILERLITE_GROUP_ID;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }

    const response = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': MAILERLITE_API_KEY!,
      },
      body: JSON.stringify({
        email,
        groups: GROUP_ID ? [GROUP_ID] : undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.error?.message || 'Failed to subscribe' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
