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
    throw new Error("Cannot reach the server. Check that the backend is running.");
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || "Something went wrong. Try again.");
  return json;
}

// POST /api/auth/login  ->  { data: { token, user } }
export const login = (email, password) =>
  request("/api/auth/login", { method: "POST", body: { email, password } }).then((r) => r.data);

// POST /api/auth/register  ->  الدكتور بيتسجل بحالة pending
export const register = (form) =>
  request("/api/auth/register", { method: "POST", body: form });
