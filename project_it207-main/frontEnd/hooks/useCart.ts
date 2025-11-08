import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  setCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  setLoading,
} from '@/store/slices/cartSlice';
import { cartService, AddToCartRequest, UpdateCartItemRequest } from '@/services/cart';
import { useAuth } from './useAuth';

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, isLoading } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useAuth();

  // Fetch cart on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const cart = await cartService.getCart();
      dispatch(setCart(cart));
    } catch (err: any) {
      console.error('Failed to fetch cart:', err);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const addToCart = useCallback(
    async (data: AddToCartRequest) => {
      try {
        dispatch(setLoading(true));
        const cart = await cartService.addToCart(data);
        dispatch(setCart(cart));
        return cart;
      } catch (err: any) {
        console.error('Failed to add to cart:', err);
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const updateCartItem = useCallback(
    async (itemId: string, data: UpdateCartItemRequest) => {
      try {
        dispatch(setLoading(true));
        const cart = await cartService.updateCartItem(itemId, data);
        dispatch(setCart(cart));
        return cart;
      } catch (err: any) {
        console.error('Failed to update cart item:', err);
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const removeFromCart = useCallback(
    async (itemId: string) => {
      try {
        dispatch(setLoading(true));
        const cart = await cartService.removeFromCart(itemId);
        dispatch(setCart(cart));
        return cart;
      } catch (err: any) {
        console.error('Failed to remove from cart:', err);
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const clearCartItems = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await cartService.clearCart();
      dispatch(clearCart());
    } catch (err: any) {
      console.error('Failed to clear cart:', err);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    items,
    total,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart: clearCartItems,
    fetchCart,
  };
};





