import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "portfolio-auth-token";
const AUTH_TOKEN = "cleo-auth-session-2026";
const CREDENTIALS = { username: "cleoameylia", password: "cleoamey23" };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      const response = NextResponse.json({ success: true });
      response.cookies.set(AUTH_COOKIE, AUTH_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    }

    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
