import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
const BACKEND_URL = `${BASE_URL}/api/auth/profile`;

export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const res = await fetch(BACKEND_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
