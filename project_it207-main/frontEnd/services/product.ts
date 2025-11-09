import { axiosInstance } from '@/utils/axios-instance';
import { Product } from '@/types';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface ProductResponse {
  products: Product[];
  page: number;
  limit: number;
  total: number;
}

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  status: string;
};

type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export const productService = {
  async getAll(params?: ProductQueryParams): Promise<ProductResponse> {
    const page = params?.page || 0;
    const size = params?.limit || 10;
    const res = await axiosInstance.get<APIResponse<PageResponse<Product>>>('/products', {
      params: {
        page,
        size,
        ...(params?.category && { category: params.category }),
        ...(params?.search && { search: params.search }),
        ...(params?.sortBy && { sortBy: params.sortBy }),
        ...(params?.order && { order: params.order }),
      },
    });
    
    const pageData = res.data.data;
    return {
      products: pageData.content || [],
      page: pageData.number || 0,
      limit: pageData.size || size,
      total: pageData.totalElements || 0,
    };
  },

  async getById(id: string | number): Promise<Product> {
    const res = await axiosInstance.get<APIResponse<Product>>(`/products/${id}`);
    return res.data.data;
  },
};

export default productService;

