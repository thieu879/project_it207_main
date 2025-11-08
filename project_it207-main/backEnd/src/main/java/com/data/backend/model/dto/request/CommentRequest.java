package com.data.backend.model.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {
    @NotNull private Long productId;
    @NotBlank private String content;
}
