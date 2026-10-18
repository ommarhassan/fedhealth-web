// التوكن: لو "Remember Me" متعلّم بيتخزن في localStorage، غير كده في sessionStorage
const KEY = "fedhealth_session";

export function saveSession(token, user, remember) {
  clearSession();
  (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify({ token, user }));
}

export function getSession() {
  const raw = localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
}
