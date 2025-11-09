import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartResponse, CartItem } from '@/services/cart';

interface CartState {
  cart: CartResponse | null;
  items: CartItem[];
  total: number;
  isLoading: boolean;
}

const initialState: CartState = {
  cart: null,
  items: [],
  total: 0,
  isLoading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCart: (state, action: PayloadAction<CartResponse>) => {
      state.cart = action.payload;
      state.items = action.payload.items || [];
      state.total = action.payload.totalPrice || 0;
    },
    clearCart: (state) => {
      state.cart = null;
      state.items = [];
      state.total = 0;
    },
  },
});

export const { setLoading, setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;





