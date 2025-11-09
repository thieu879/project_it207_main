import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  setCart,
  clearCart as clearCartAction,
  setLoading,
} from '@/store/slices/cartSlice';
import { cartService, CartRequest } from '@/services/cart';
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
    async (productId: number, quantity: number = 1) => {
      try {
        dispatch(setLoading(true));
        const cart = await cartService.addToCart(productId, quantity);
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
    async (productId: number, quantity: number) => {
      try {
        dispatch(setLoading(true));
        const cart = await cartService.updateCartItem(productId, quantity);
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
    async (productId: number) => {
      try {
        dispatch(setLoading(true));
        await cartService.removeFromCart(productId);
        await fetchCart(); // Refresh cart
      } catch (err: any) {
        console.error('Failed to remove from cart:', err);
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, fetchCart]
  );

  const clearCartItems = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await cartService.clearCart();
      dispatch(clearCartAction());
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





