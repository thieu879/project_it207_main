package com.data.backend.service.user;

import com.data.backend.model.dto.request.UpdateUserRequest;
import com.data.backend.model.dto.response.UserResponse;
import com.data.backend.model.entity.User;

public interface UserService {
    User findUserByUsername(String username);
    UserResponse getUserProfile(String username);
    UserResponse updateUserProfile(String username, UpdateUserRequest request);
}
