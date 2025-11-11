import { axiosInstance } from '@/utils/axios-instance';
import { Category } from '@/types';

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  status: string;
};

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const res = await axiosInstance.get<APIResponse<Category[]>>('/categories');
    return res.data.data || [];
  },

  async getById(id: string | number): Promise<Category> {
    const res = await axiosInstance.get<APIResponse<Category>>(`/categories/${id}`);
    return res.data.data;
  },
};

export default categoryService;





