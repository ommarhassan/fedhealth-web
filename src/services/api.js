const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, { method = "GET", body, token } = {}) {
  let res;
  try {
    res = await fetch(BASE_URL + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw Object.assign(new Error("Network error"), { status: 0 });
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) throw Object.assign(new Error(json?.message || "Request failed"), { status: res.status });
  return json;
}

// POST /api/auth/login  ->  { data: { token, user } }
export const login = (email, password) =>
  request("/api/auth/login", { method: "POST", body: { email, password } }).then((r) => r.data);

// POST /api/auth/register  ->  الدكتور بيتسجل بحالة pending
export const register = (form) =>
  request("/api/auth/register", { method: "POST", body: form });

// POST /api/auth/forgot-password  ->  نفس الرد سواء الإيميل موجود أو لأ
export const forgotPassword = (email) =>
  request("/api/auth/forgot-password", { method: "POST", body: { email } });

// POST /api/auth/reset-password
export const resetPassword = (token, password) =>
  request("/api/auth/reset-password", { method: "POST", body: { token, password } });
