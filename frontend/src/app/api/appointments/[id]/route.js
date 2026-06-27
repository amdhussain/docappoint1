import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000/api/appointments';

async function fetchWithFallback(url, options) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    return null;
  }
}

export async function PUT(request, { params }) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const id = params.id;
    const body = await request.json();

    const res = await fetchWithFallback(`${BACKEND_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!res) {
      return NextResponse.json(
        { message: 'Backend unavailable. Please ensure the backend server is running.' },
        { status: 503 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const id = params.id;

    const res = await fetchWithFallback(`${BACKEND_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: authHeader,
      },
    });

    if (!res) {
      return NextResponse.json(
        { message: 'Backend unavailable. Please ensure the backend server is running.' },
        { status: 503 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
