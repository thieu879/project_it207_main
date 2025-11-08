package com.data.backend.controller;

import com.data.backend.model.dto.APIResponse;
import com.data.backend.model.dto.request.CommentRequest;
import com.data.backend.model.dto.response.CommentResponse;
import com.data.backend.service.comment.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<APIResponse<List<CommentResponse>>> getCommentsForProduct(@PathVariable Long productId) {
        List<CommentResponse> comments = commentService.getCommentsByProductId(productId);
        APIResponse<List<CommentResponse>> response = APIResponse.<List<CommentResponse>>builder()
                .success(true)
                .message("Comments fetched successfully.")
                .data(comments)
                .status(HttpStatus.OK)
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<APIResponse<CommentResponse>> postComment(
            Authentication authentication,
            @Valid @RequestBody CommentRequest request) {
        CommentResponse newComment = commentService.addComment(authentication.getName(), request);
        APIResponse<CommentResponse> response = APIResponse.<CommentResponse>builder()
                .success(true)
                .message("Comment posted successfully.")
                .data(newComment)
                .status(HttpStatus.CREATED)
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<APIResponse<Void>> deleteComment(
            Authentication authentication,
            @PathVariable Long commentId) {
        commentService.deleteComment(authentication.getName(), commentId);
        APIResponse<Void> response = APIResponse.<Void>builder()
                .success(true)
                .message("Comment deleted successfully.")
                .status(HttpStatus.OK)
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
