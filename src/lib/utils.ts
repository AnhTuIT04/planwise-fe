import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getCookieServer(name: string) {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value ?? null;
}

export function getCookieClient(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function getCookie(name: string): Promise<string | null> {
  if (typeof window === "undefined") {
    return getCookieServer(name);
  } else {
    return getCookieClient(name);
  }
}

export function setCookieClient(name: string, value: string, days: number = 7, path: string = "/"): void {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=${path}`;
}

export function deleteCookieClient(name: string, path: string = "/"): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
}
