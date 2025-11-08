package com.data.backend.model.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequest {
    @NotNull @Min(1) @Max(5) private int rating;
    @NotBlank private String content;
}
