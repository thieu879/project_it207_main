package com.data.backend.controller;

import com.data.backend.model.dto.APIResponse;
import com.data.backend.model.dto.request.LoginRequest;
import com.data.backend.model.dto.request.SignupRequest;
import com.data.backend.service.auth.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<APIResponse<String>> handleRegister(@Valid @RequestBody SignupRequest signupRequest) {
        authService.register(signupRequest);
        APIResponse<String> response = APIResponse.<String>builder()
                .success(true)
                .message("Registration successful! Please check your email to verify your account.")
                .status(HttpStatus.CREATED)
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<APIResponse<?>> handleLogin(@Valid @RequestBody LoginRequest loginRequest) {
        APIResponse<?> response = APIResponse.builder()
                .success(true)
                .message("Login successful.")
                .data(authService.login(loginRequest))
                .status(HttpStatus.OK)
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
