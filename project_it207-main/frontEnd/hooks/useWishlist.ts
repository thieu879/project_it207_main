import { useState, useCallback, useEffect } from 'react';
import { wishlistService } from '@/services/wishlist';
import { useAuth } from './useAuth';

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      const wishlist = await wishlistService.getWishlist();
      setWishlistItems(wishlist.map((item) => item.product.id));
    } catch (err: any) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToWishlist = useCallback(async (productId: number) => {
    try {
      setIsLoading(true);
      await wishlistService.addToWishlist(productId);
      setWishlistItems((prev) => [...prev, productId]);
    } catch (err: any) {
      console.error('Failed to add to wishlist:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFromWishlist = useCallback(async (productId: number) => {
    try {
      setIsLoading(true);
      await wishlistService.removeFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((id) => id !== productId));
    } catch (err: any) {
      console.error('Failed to remove from wishlist:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleWishlist = useCallback(
    async (productId: number) => {
      if (wishlistItems.includes(productId)) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    },
    [wishlistItems, addToWishlist, removeFromWishlist]
  );

  const isInWishlist = useCallback(
    (productId: number) => {
      return wishlistItems.includes(productId);
    },
    [wishlistItems]
  );

  return {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    fetchWishlist,
  };
};



