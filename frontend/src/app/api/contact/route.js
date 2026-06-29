import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
const BACKEND_URL = `${BASE_URL}/api/contact`;

export async function POST(request) {
  try {
    const body = await request.json();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const message =
      error.name === 'AbortError'
        ? 'Backend server not responding (timeout).'
        : error.cause?.code === 'ECONNREFUSED'
        ? 'Cannot connect to backend server.'
        : error.message;
    return NextResponse.json(
      { success: false, message },
      { status: 503 }
    );
  }
}
