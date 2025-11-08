import { User } from "@/types";
import { axiosInstance } from "@/utils/axios-instance";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  role?: string[];
}

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  status: string;
};

type JWTResponse = {
  token: string;
  username: string;
  email: string;
  enabled: boolean;
  isActive: boolean;
  authorities: Array<{ authority: string }>;
};

type UserResponse = {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  roles: string[];
};

function mapUserResponseToUser(u: UserResponse): User {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    password: "",
    isActive: u.isActive,
    roles: (u.roles || []).map((r, idx) => ({ id: idx + 1, roleName: r as any })),
    orders: [],
    cart: undefined as any,
    feedbacks: [],
    comments: [],
    wishlists: [],
  };
}

async function fetchMe(token: string): Promise<User> {
  const res = await axiosInstance.get<APIResponse<UserResponse>>("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return mapUserResponseToUser(res.data.data);
}

export const authService = {
  async login(payload: LoginRequest): Promise<{ user: User; token: string }> {
    const res = await axiosInstance.post<APIResponse<JWTResponse>>("/auth/login", payload);
    const token = res.data.data.token;
    const user = await fetchMe(token);
    return { user, token };
  },

  async signUp(payload: SignUpRequest): Promise<{ user: User; token: string }> {
    await axiosInstance.post<APIResponse<unknown>>("/auth/register", payload);
    const { user, token } = await this.login({ username: payload.username, password: payload.password });
    return { user, token };
  },

  async logout(): Promise<void> {
    return Promise.resolve();
  },
};

export default authService;