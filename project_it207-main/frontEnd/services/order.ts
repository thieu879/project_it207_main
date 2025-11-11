import { axiosInstance } from '@/utils/axios-instance';

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  status: string;
};

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface OrderTracking {
  status: string;
  timestamp: string;
  location?: string;
}

export interface OrderDetail {
  id: number;
  username: string;
  orderDate: string;
  totalAmount: number;
  orderItems: OrderItem[];
  trackingHistory: OrderTracking[];
}

export const orderService = {
  async createOrder(): Promise<OrderDetail> {
    const res = await axiosInstance.post<APIResponse<OrderDetail>>('/orders');
    return res.data.data;
  },

  async getOrders(): Promise<OrderDetail[]> {
    const res = await axiosInstance.get<APIResponse<OrderDetail[]>>('/orders');
    return res.data.data;
  },

  async getOrderById(orderId: number): Promise<OrderDetail> {
    const res = await axiosInstance.get<APIResponse<OrderDetail>>(`/orders/${orderId}`);
    return res.data.data;
  },

  async cancelOrder(orderId: number): Promise<void> {
    await axiosInstance.put<APIResponse<void>>(`/orders/${orderId}/cancel`);
  },
};

export default orderService;



