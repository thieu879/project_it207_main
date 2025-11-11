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
    try {
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
      
      console.log('API Response:', JSON.stringify(res.data, null, 2));
      
      if (!res.data) {
        console.error('No response data');
        return {
          products: [],
          page: 0,
          limit: size,
          total: 0,
        };
      }

      if (!res.data.data) {
        console.error('No data property in response:', res.data);
        return {
          products: [],
          page: 0,
          limit: size,
          total: 0,
        };
      }
      
      const pageData = res.data.data;
      
      if (!pageData || typeof pageData !== 'object') {
        console.error('Invalid pageData type:', typeof pageData, pageData);
        return {
          products: [],
          page: 0,
          limit: size,
          total: 0,
        };
      }
      
      const products = Array.isArray(pageData.content) ? pageData.content : [];
      const pageNumber = typeof pageData.number === 'number' ? pageData.number : page;
      const pageSize = typeof pageData.size === 'number' ? pageData.size : size;
      const total = typeof pageData.totalElements === 'number' ? pageData.totalElements : 0;
      
      return {
        products,
        page: pageNumber,
        limit: pageSize,
        total,
      };
    } catch (error: any) {
      console.error('Error fetching products:', error);
      console.error('Error response:', error.response?.data);
      return {
        products: [],
        page: params?.page || 0,
        limit: params?.limit || 10,
        total: 0,
      };
    }
  },

  async getById(id: string | number): Promise<Product> {
    const res = await axiosInstance.get<APIResponse<Product>>(`/products/${id}`);
    return res.data.data;
  },
};

export default productService;





