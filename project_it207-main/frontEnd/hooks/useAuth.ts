import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { setAuth, logout as logoutAction, setLoading, updateUser } from '@/store/slices/authSlice';
import { axiosInstance } from '@/utils/axios-instance';
import { authService, LoginRequest, SignUpRequest } from '@/apis/auth';
import { User } from '@/types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setError(null);
        dispatch(setLoading(true));
        const response = await authService.login(credentials);
        axiosInstance.defaults.headers.Authorization = `Bearer ${response.token}`;
        dispatch(setAuth({ user: response.user, token: response.token }));
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Login failed';
        setError(errorMessage);
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const signUp = useCallback(
    async (data: SignUpRequest) => {
      try {
        setError(null);
        dispatch(setLoading(true));
        const response = await authService.signUp(data);
        axiosInstance.defaults.headers.Authorization = `Bearer ${response.token}`;
        dispatch(setAuth({ user: response.user, token: response.token }));
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Sign up failed';
        setError(errorMessage);
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      dispatch(logoutAction());
      delete axiosInstance.defaults.headers.Authorization;
    }
  }, [dispatch]);

  const updateUserInfo = useCallback(
    (userData: Partial<User>) => {
      dispatch(updateUser(userData));
    },
    [dispatch]
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    signUp,
    logout,
    updateUserInfo,
  };
};

