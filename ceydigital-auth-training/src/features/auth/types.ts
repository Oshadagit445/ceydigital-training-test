export type User = {
  id: number;
  full_name: string;
  email: string;
};

export type SignupRequest = {
  full_name: string;
  email: string;
  password: string;
};

export type SignupResponse = {
  user: User;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
};

export type ApiError = {
  message: string;
  status?: number;
};