import axios from "axios";

const BASE_URL = import.meta.env.VITE_FRAPPE_BASE_URL;

const sessionApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Accept": "application/json", "Content-Type": "application/json" },
  withCredentials: true,
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

  const userRes = await sessionApi.get("/api/method/frappe.auth.get_logged_user");
  const loggedUser = userRes.data.message;

  const rolesRes = await sessionApi.post("/api/method/frappe.auth.get_user_roles");
  const roles: string[] = rolesRes.data.message || [];

  return { email: loggedUser, fullName: loggedUser, roles };
}

export function determineRole(roles: string[]): "librarian" | "assistant" | "member" {
  if (roles.includes("Librarian")) return "librarian";
  if (roles.includes("Assistant")) return "assistant";
  return "member";
}
