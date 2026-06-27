// import { NextResponse } from 'next/server';

// const BACKEND_URL = 'http://localhost:5000/api/auth';

// export async function POST(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const action = searchParams.get('action');

//     let endpoint;
//     if (action === 'register') {
//       endpoint = `${BACKEND_URL}/register`;
//     } else {
//       endpoint = `${BACKEND_URL}/login`;
//     }

//     const body = await request.json();

//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 10000);

//     const res = await fetch(endpoint, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//       signal: controller.signal,
//     });

//     clearTimeout(timeoutId);

//     const data = await res.json();

//     return NextResponse.json(data, { status: res.status });
//   } catch (error) {
//     const message =
//       error.name === 'AbortError'
//         ? 'Backend server not responding (timeout). Make sure the backend is running on port 5000.'
//         : error.cause?.code === 'ECONNREFUSED'
//         ? 'Cannot connect to backend server. Run the backend first: cd backend && npm run dev'
//         : error.message;
//     return NextResponse.json(
//       { error: 'Backend unavailable', message },
//       { status: 503 }
//     );
//   }
// }

// export async function GET(request) {
//   try {
//     const authHeader = request.headers.get('authorization');

//     if (!authHeader) {
//       return NextResponse.json(
//         { error: 'Authorization header required' },
//         { status: 401 }
//       );
//     }

//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 10000);

//     const res = await fetch(`${BACKEND_URL}/me`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: authHeader,
//       },
//       signal: controller.signal,
//     });

//     clearTimeout(timeoutId);

//     const data = await res.json();

//     return NextResponse.json(data, { status: res.status });
//   } catch (error) {
//     const message =
//       error.name === 'AbortError'
//         ? 'Backend server not responding (timeout).'
//         : error.cause?.code === 'ECONNREFUSED'
//         ? 'Cannot connect to backend server.'
//         : error.message;
//     return NextResponse.json(
//       { error: 'Backend unavailable', message },
//       { status: 503 }
//     );
//   }
// }

// export async function GET(request) {
//   try {
//     const authHeader = request.headers.get('authorization');

//     if (!authHeader) {
//       return NextResponse.json(
//         { error: 'Authorization header required' },
//         { status: 401 }
//       );
//     }

//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 5000);

//     const res = await fetch(`${BACKEND_URL}/me`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: authHeader,
//       },
//       signal: controller.signal,
//     });

//     clearTimeout(timeoutId);

//     const data = await res.json();

//     return NextResponse.json(data, { status: res.status });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Internal server error', message: error.message },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000/api/auth';

// ১. ইউজার রেজিস্ট্রেশন এবং লগইনের জন্য POST মেথড
export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    let endpoint;
    if (action === 'register') {
      endpoint = `${BACKEND_URL}/register`;
    } else {
      endpoint = `${BACKEND_URL}/login`;
    }

    const body = await request.json();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(endpoint, {
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
        ? 'Backend server not responding (timeout). Make sure the backend is running on port 5000.'
        : error.cause?.code === 'ECONNREFUSED'
        ? 'Cannot connect to backend server. Run the backend first: cd backend && npm run dev'
        : error.message;
    return NextResponse.json(
      { error: 'Backend unavailable', message },
      { status: 503 }
    );
  }
}

// ২. কারেন্ট ইউজার ডাটা (Profile) চেক করার জন্য একটি মাত্র GET মেথড
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${BACKEND_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
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
      { error: 'Backend unavailable', message },
      { status: 503 }
    );
  }
}