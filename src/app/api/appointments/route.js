// import { NextResponse } from 'next/server';

// const BACKEND_URL = 'http://localhost:5000/api/appointments';

// export async function GET(request) {
//   try {
//     const authHeader = request.headers.get('authorization');

//     if (!authHeader) {
//       return NextResponse.json(
//         { error: 'Authorization header required' },
//         { status: 401 }
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const queryString = searchParams.toString();
//     const url = queryString ? `${BACKEND_URL}?${queryString}` : BACKEND_URL;

//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 3000);

//     try {
//       const res = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: authHeader,
//         },
//         signal: controller.signal,
//       });
//       clearTimeout(timeoutId);

//       const data = await res.json();
//       return NextResponse.json(data, { status: res.status });
//     } catch (fetchError) {
//       clearTimeout(timeoutId);
//       return NextResponse.json(
//         { message: 'Backend unavailable. Please ensure the backend server is running.', appointments: [] },
//         { status: 503 }
//       );
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Internal server error', message: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request) {
//   try {
//     const authHeader = request.headers.get('authorization');

//     if (!authHeader) {
//       return NextResponse.json(
//         { error: 'Authorization header required' },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();

//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 3000);

//     try {
//       const res = await fetch(BACKEND_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: authHeader,
//         },
//         body: JSON.stringify(body),
//         signal: controller.signal,
//       });
//       clearTimeout(timeoutId);

//       const data = await res.json();
//       return NextResponse.json(data, { status: res.status });
//     } catch (fetchError) {
//       clearTimeout(timeoutId);
//       return NextResponse.json(
//         { message: 'Backend unavailable. Please ensure the backend server is running.', success: false },
//         { status: 503 }
//       );
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Internal server error', message: error.message },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000/api/appointments';

export async function POST(request) {
  try {
    // হেডার ধরার সময় ছোট হাতের 'authorization' ব্যবহার করা নিরাপদ
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // টাইমআউট একটু বাড়িয়ে দিলাম

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader, // ফ্রন্টএন্ড থেকে পাওয়া হেডারটি সরাসরি পাস করে দাও
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      return NextResponse.json(
        { message: 'Backend unavailable.', success: false },
        { status: 503 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// GET মেথডের জন্যও একইভাবে হেডার ঠিক করে নাও
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = queryString ? `${BACKEND_URL}?${queryString}` : BACKEND_URL;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}