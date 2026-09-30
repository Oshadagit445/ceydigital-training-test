// src/types/api.ts
export type { ApiError } from "../features/auth/types";

export type ApiErrorKind = 
| "validation"
| "authentication"
| "authorization"
| "not_found"
| "server"
| "network";
