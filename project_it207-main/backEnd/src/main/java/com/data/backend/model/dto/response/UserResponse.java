package com.data.backend.model.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private boolean isActive;
    private Set<String> roles;
}
