package com.data.backend.controller;

import com.data.backend.model.dto.APIResponse;
import com.data.backend.model.dto.request.UpdateUserRequest;
import com.data.backend.model.dto.response.UserResponse;
import com.data.backend.service.user.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<APIResponse<UserResponse>> getMyProfile(Authentication authentication) {
        UserResponse profile = userService.getUserProfile(authentication.getName());
        return new ResponseEntity<>(APIResponse.<UserResponse>builder().success(true).message("Profile fetched successfully.").data(profile).status(HttpStatus.OK).build(), HttpStatus.OK);
    }
    @PutMapping("/me")
    public ResponseEntity<APIResponse<UserResponse>> updateMyProfile(Authentication authentication, @Valid @RequestBody UpdateUserRequest request) {
        UserResponse updatedProfile = userService.updateUserProfile(authentication.getName(), request);
        return new ResponseEntity<>(APIResponse.<UserResponse>builder().success(true).message("Profile updated successfully.").data(updatedProfile).status(HttpStatus.OK).build(), HttpStatus.OK);
    }
}
