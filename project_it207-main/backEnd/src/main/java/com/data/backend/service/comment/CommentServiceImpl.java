package com.data.backend.service.comment;

import com.data.backend.model.dto.request.CommentRequest;
import com.data.backend.model.dto.response.CommentResponse;
import com.data.backend.model.entity.Comment;
import com.data.backend.model.entity.Product;
import com.data.backend.model.entity.User;
import com.data.backend.repository.CommentRepository;
import com.data.backend.repository.ProductRepository;
import com.data.backend.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired private CommentRepository commentRepository;
    @Autowired private UserService userService;
    @Autowired private ProductRepository productRepository;

    @Override
    public List<CommentResponse> getCommentsByProductId(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new EntityNotFoundException("Product not found with id: " + productId);
        }
        return commentRepository.findByProductId(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CommentResponse addComment(String username, CommentRequest request) {
        User user = userService.findUserByUsername(username);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + request.getProductId()));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setProduct(product);
        comment.setContent(request.getContent());

        Comment savedComment = commentRepository.save(comment);
        return mapToResponse(savedComment);
    }

    @Override
    public void deleteComment(String username, Long commentId) {
        User user = userService.findUserByUsername(username);
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with id: " + commentId));
        boolean isAdmin = user.getRoles().stream().anyMatch(role -> role.getRoleName().name().equals("ROLE_ADMIN"));
        if (!comment.getUser().getId().equals(user.getId()) && !isAdmin) {
            throw new SecurityException("User does not have permission to delete this comment.");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse mapToResponse(Comment comment) {
        CommentResponse res = new CommentResponse();
        res.setId(comment.getId());
        res.setContent(comment.getContent());
        res.setUsername(comment.getUser().getUsername());
        res.setCreatedAt(comment.getCreatedAt());
        return res;
    }
}
