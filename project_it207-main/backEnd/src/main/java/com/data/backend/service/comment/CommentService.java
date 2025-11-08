package com.data.backend.service.comment;

import com.data.backend.model.dto.request.CommentRequest;
import com.data.backend.model.dto.response.CommentResponse;
import java.util.List;

public interface CommentService {
    List<CommentResponse> getCommentsByProductId(Long productId);
    CommentResponse addComment(String username, CommentRequest request);
    void deleteComment(String username, Long commentId);
}
