import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  setProducts,
  setSelectedProduct,
  setFilters,
  setPagination,
  setLoading,
  setError,
} from '@/store/slices/productSlice';
import { productService, ProductQueryParams } from '@/services/product';
import { Product } from '@/types';

export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, selectedProduct, isLoading, error, filters, pagination } = useSelector(
    (state: RootState) => state.product
  );

  const fetchProducts = useCallback(
    async (params?: ProductQueryParams) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const response = await productService.getAll({
          ...filters,
          ...params,
          page: pagination.page,
          limit: pagination.limit,
        });
        dispatch(setProducts({ products: response.products, total: response.total }));
        dispatch(
          setPagination({
            page: response.page,
            limit: response.limit,
            total: response.total,
          })
        );
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch products';
        dispatch(setError(errorMessage));
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, filters, pagination.page, pagination.limit]
  );

  const fetchProductById = useCallback(
    async (id: string) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const product = await productService.getById(id);
        dispatch(setSelectedProduct(product));
        return product;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch product';
        dispatch(setError(errorMessage));
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<ProductQueryParams>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const updatePagination = useCallback(
    (newPagination: Partial<typeof pagination>) => {
      dispatch(setPagination(newPagination));
    },
    [dispatch]
  );

  const clearSelectedProduct = useCallback(() => {
    dispatch(setSelectedProduct(null));
  }, [dispatch]);

  return {
    products,
    selectedProduct,
    isLoading,
    error,
    filters,
    pagination,
    fetchProducts,
    fetchProductById,
    updateFilters,
    updatePagination,
    clearSelectedProduct,
  };
};





