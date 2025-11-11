import { axiosInstance } from '@/utils/axios-instance';
import { Product } from '@/types';

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  status: string;
};

export interface WishlistItem {
  id: number;
  product: Product;
}

export const wishlistService = {
  async getWishlist(): Promise<WishlistItem[]> {
    const res = await axiosInstance.get<APIResponse<WishlistItem[]>>('/wishlist');
    return res.data.data;
  },

  async addToWishlist(productId: number): Promise<void> {
    await axiosInstance.post<APIResponse<void>>(`/wishlist/product/${productId}`);
  },

  async removeFromWishlist(productId: number): Promise<void> {
    await axiosInstance.delete<APIResponse<void>>(`/wishlist/product/${productId}`);
  },
};

export default wishlistService;



