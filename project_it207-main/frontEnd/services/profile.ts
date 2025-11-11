import { User } from '@/types';
import { axiosInstance } from '@/utils/axios-instance';

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  status: string;
};

type UpdateProfileRequest = {
  email?: string;
  password?: string;
  currentPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
};

export const profileService = {
  async fetchProfile(): Promise<User> {
    const res = await axiosInstance.get<APIResponse<any>>('/users/me');
    return res.data.data as User;
  },
  async updateProfile(payload: UpdateProfileRequest): Promise<User> {
    const res = await axiosInstance.put<APIResponse<User>>('/users/profile', payload);
    return res.data.data;
  },

  async updateAvatar(file: FormData): Promise<string> {
    const res = await axiosInstance.post<APIResponse<{ imageUrl: string }>>(
      '/users/profile/avatar',
      file,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data.data.imageUrl;
  },
};

export default profileService;