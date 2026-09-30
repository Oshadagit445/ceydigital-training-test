import { apiClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  User,
} from "../../features/auth/types";

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  return apiClient<SignupResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logout(): Promise<{ message: string }> {
  return apiClient("/auth/logout", { method: "POST" });
}

export async function getCurrentUser(UserId: string | null): Promise<User> {
  return apiClient<User>("/auth/me");
}