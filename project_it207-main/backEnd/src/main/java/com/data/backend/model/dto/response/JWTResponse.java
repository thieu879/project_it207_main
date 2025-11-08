package com.data.backend.model.dto.response;

import lombok.Builder;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;

@Data
@Builder
public class JWTResponse {
    private String token;
    private String username;
    private String email;
    private Boolean enabled;
    private Boolean isActive;
    private Collection<? extends GrantedAuthority> authorities;
}
