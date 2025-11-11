import { axiosInstance } from '@/utils/axios-instance';

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  status: string;
};

export interface Comment {
  id: number;
  content: string;
  username: string;
  createdAt: string;
}

export interface CommentRequest {
  productId: number;
  content: string;
}

export const commentService = {
  async getCommentsByProductId(productId: number): Promise<Comment[]> {
    const res = await axiosInstance.get<APIResponse<Comment[]>>(
      `/comments/product/${productId}`
    );
    return res.data.data;
  },

  async addComment(productId: number, content: string): Promise<Comment> {
    const res = await axiosInstance.post<APIResponse<Comment>>('/comments', {
      productId,
      content,
    });
    return res.data.data;
  },

  async deleteComment(commentId: number): Promise<void> {
    await axiosInstance.delete<APIResponse<void>>(`/comments/${commentId}`);
  },
};

export default commentService;



