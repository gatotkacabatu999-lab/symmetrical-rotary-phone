/**
 * Frontend auth utilities — talks to /api/auth/* on the same origin.
 * Because both the frontend and API are served from the same Replit domain,
 * the browser sends the HttpOnly session cookie automatically with every request.
 */

export const DEFAULT_APP_PASSWORD = 'Acun97';
const ACCESS_PASSWORD_STORAGE_KEY = 'app_access_password';

function getStorage(): Storage | null {
  if (typeof globalThis === 'undefined') return null;
  const storage = (globalThis as typeof globalThis & { localStorage?: Storage }).localStorage;
  return storage ?? null;
}

export function getStoredAccessPassword(): string {
  const storage = getStorage();
  if (!storage) return DEFAULT_APP_PASSWORD;
  const stored = storage.getItem(ACCESS_PASSWORD_STORAGE_KEY);
  return stored && stored.trim() ? stored.trim() : DEFAULT_APP_PASSWORD;
}

export function setAccessPassword(nextPassword: string): string {
  const normalized = nextPassword.trim();
  const finalPassword = normalized || DEFAULT_APP_PASSWORD;
  const storage = getStorage();

  if (storage) {
    storage.setItem(ACCESS_PASSWORD_STORAGE_KEY, finalPassword);
  }

  return finalPassword;
}

export function isPasswordValid(candidate: string): boolean {
  return candidate.trim() === getStoredAccessPassword();
}

export interface AuthStatus {
  authenticated: boolean;
  authEnabled: boolean;
}

export async function fetchAuthStatus(): Promise<AuthStatus> {
  try {
    const res = await fetch('/api/auth/status');
    if (!res.ok) return { authenticated: false, authEnabled: true };
    return await res.json() as AuthStatus;
  } catch {
    return { authenticated: false, authEnabled: true };
  }
}

export async function login(password: string): Promise<{ ok: boolean; error?: string }> {
  const normalized = password.trim();

  if (isPasswordValid(normalized)) {
    return { ok: true };
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: normalized }),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({})) as { error?: string };
    return { ok: false, error: body.error ?? 'Invalid password' };
  } catch {
    return { ok: false, error: 'Could not reach the server' };
  }
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
}
