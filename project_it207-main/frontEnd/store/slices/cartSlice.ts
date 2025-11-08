import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Cart } from '@/types';

interface CartState {
  cart: Cart | null;
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
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.total = existingItem.price * existingItem.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.total = state.items.reduce((sum, item) => sum + item.total, 0);
    },
    updateItem: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        item.total = item.price * item.quantity;
        state.total = state.items.reduce((sum, item) => sum + item.total, 0);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.total, 0);
    },
    clearCart: (state) => {
      state.cart = null;
      state.items = [];
      state.total = 0;
    },
  },
});

export const { setLoading, setCart, addItem, updateItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;





