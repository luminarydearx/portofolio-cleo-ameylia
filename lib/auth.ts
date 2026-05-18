import { cookies } from "next/headers";

const AUTH_COOKIE = "portfolio-auth-token";
const AUTH_TOKEN = "cleo-auth-session-2026";

export const CREDENTIALS = {
  username: "cleoameylia",
  password: "cleoamey23",
};

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE);
  return token?.value === AUTH_TOKEN;
}

export function getAuthToken(): string {
  return AUTH_TOKEN;
}

export function getAuthCookieName(): string {
  return AUTH_COOKIE;
}
