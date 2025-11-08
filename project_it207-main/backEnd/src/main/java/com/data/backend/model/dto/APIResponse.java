package com.data.backend.model.dto;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@Builder
public class APIResponse<T> {
    private Boolean success;
    private String message;
    private T data;
    private HttpStatus status;
}
