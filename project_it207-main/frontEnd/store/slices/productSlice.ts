import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    category?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProducts: (state, action: PayloadAction<{ products: Product[]; total: number }>) => {
      state.products = action.payload.products;
      state.pagination.total = action.payload.total;
      state.isLoading = false;
      state.error = null;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setFilters: (state, action: PayloadAction<ProductState['filters']>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    setPagination: (state, action: PayloadAction<Partial<ProductState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      if (state.selectedProduct?.id === action.payload.id) {
        state.selectedProduct = action.payload;
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      if (state.selectedProduct?.id === action.payload) {
        state.selectedProduct = null;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setProducts,
  setSelectedProduct,
  setFilters,
  setPagination,
  addProduct,
  updateProduct,
  removeProduct,
} = productSlice.actions;
export default productSlice.reducer;





