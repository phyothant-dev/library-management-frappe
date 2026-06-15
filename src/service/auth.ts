import axios from "axios";

const BASE_URL = import.meta.env.VITE_FRAPPE_BASE_URL;
const API_KEY = import.meta.env.VITE_FRAPPE_API_KEY;
const API_SECRET = import.meta.env.VITE_FRAPPE_API_SECRET;

const sessionApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Accept": "application/json", "Content-Type": "application/json" },
  withCredentials: true,
});

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `token ${API_KEY}:${API_SECRET}`,
  },
});

export interface AuthResult {
  email: string;
  fullName: string;
  roles: string[];
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const formData = new URLSearchParams();
  formData.append("usr", email);
  formData.append("pwd", password);

  const loginRes = await sessionApi.post("/api/method/login", formData.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (loginRes.data.message !== "Logged In") {
    throw new Error(loginRes.data.message || "Login failed");
  }

  // Use API key auth for role lookup — cross-origin session cookies may be
  // blocked by the browser (SameSite=Lax), so we can't rely on them.
  const userRes = await api.get(`/api/resource/User/${encodeURIComponent(email)}`);
  const userData = userRes.data.data;
  const roles: string[] = (userData.roles || []).map((r: { role: string }) => r.role);

  return { email, fullName: email, roles };
}

export function determineRole(roles: string[]): "librarian" | "assistant" | "member" {
  if (roles.some(r => r === "Librarian")) return "librarian";
  if (roles.some(r => r === "Assistant" || r === "Assistant Librarian")) return "assistant";
  return "member";
}
