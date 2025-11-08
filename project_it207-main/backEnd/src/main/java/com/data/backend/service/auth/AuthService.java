package com.data.backend.service.auth;

import com.data.backend.model.dto.request.LoginRequest;
import com.data.backend.model.dto.request.SignupRequest;
import com.data.backend.model.dto.response.JWTResponse;

public interface AuthService {
    void register(SignupRequest signupRequest);
    JWTResponse login(LoginRequest loginRequest);
}
