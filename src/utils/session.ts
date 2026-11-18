// The member's sign-in session, kept on this device. The token is signed by the
// server; the browser cannot create or change one.
const TOKEN_KEY = 'tensemaster_session_v1';
const EMAIL_KEY = 'tensemaster_session_email_v1';

const read = (key: string) => { try { return localStorage.getItem(key); } catch { return null; } };
const write = (key: string, value: string | null) => {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // Private windows can block storage; the session then lasts for this visit only.
  }
};

let memoryToken: string | null = null;
let memoryEmail: string | null = null;

export const getSessionToken = () => memoryToken ?? read(TOKEN_KEY);
export const getSessionEmail = () => memoryEmail ?? read(EMAIL_KEY);

export function saveSession(token: string, email: string) {
  memoryToken = token; memoryEmail = email;
  write(TOKEN_KEY, token); write(EMAIL_KEY, email);
}

export function clearSession() {
  memoryToken = null; memoryEmail = null;
  write(TOKEN_KEY, null); write(EMAIL_KEY, null);
}

export function authHeaders(): Record<string, string> {
  const token = getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
