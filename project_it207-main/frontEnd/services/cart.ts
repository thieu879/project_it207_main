import { axiosInstance } from '@/utils/axios-instance';

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  status: string;
};

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface CartResponse {
  cartId: number;
  items: CartItem[];
  totalPrice: number;
}

export interface CartRequest {
  productId: number;
  quantity: number;
}

export const cartService = {
  async getCart(): Promise<CartResponse> {
    const res = await axiosInstance.get<APIResponse<CartResponse>>('/cart');
    return res.data.data;
  },

  async addToCart(productId: number, quantity: number): Promise<CartResponse> {
    const res = await axiosInstance.post<APIResponse<CartResponse>>('/cart', {
      productId,
      quantity,
    });
    return res.data.data;
  },

  async updateCartItem(productId: number, quantity: number): Promise<CartResponse> {
    const res = await axiosInstance.put<APIResponse<CartResponse>>(
      `/cart/products/${productId}?quantity=${quantity}`
    );
    return res.data.data;
  },

  async removeFromCart(productId: number): Promise<void> {
    await axiosInstance.delete<APIResponse<void>>(`/cart/products/${productId}`);
  },

  async clearCart(): Promise<void> {
    await axiosInstance.delete<APIResponse<void>>('/cart');
  },
};

export default cartService;

