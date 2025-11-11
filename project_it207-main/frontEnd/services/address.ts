import { axiosInstance } from '@/utils/axios-instance';

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  status: string;
};

export interface Address {
  id: number;
  label: string;
  fullAddress: string;
  addressType?: string;
  isDefault?: boolean;
}

export interface AddressRequest {
  label: string;
  fullAddress: string;
  addressType?: string;
  isDefault?: boolean;
}

export const addressService = {
  async getAddresses(): Promise<Address[]> {
    const res = await axiosInstance.get<APIResponse<Address[]>>('/addresses');
    return res.data.data;
  },

  async getAddressById(id: number): Promise<Address> {
    const res = await axiosInstance.get<APIResponse<Address>>(`/addresses/${id}`);
    return res.data.data;
  },

  async createAddress(request: AddressRequest): Promise<Address> {
    const res = await axiosInstance.post<APIResponse<Address>>('/addresses', request);
    return res.data.data;
  },

  async updateAddress(id: number, request: AddressRequest): Promise<Address> {
    const res = await axiosInstance.put<APIResponse<Address>>(`/addresses/${id}`, request);
    return res.data.data;
  },

  async deleteAddress(id: number): Promise<void> {
    await axiosInstance.delete<APIResponse<void>>(`/addresses/${id}`);
  },

  async setDefaultAddress(id: number): Promise<Address> {
    const res = await axiosInstance.put<APIResponse<Address>>(`/addresses/${id}/set-default`);
    return res.data.data;
  },
};

export default addressService;

