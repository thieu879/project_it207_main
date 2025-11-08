package com.data.backend.service.user;

import com.data.backend.model.dto.request.UpdateUserRequest;
import com.data.backend.model.dto.response.UserResponse;
import com.data.backend.model.entity.User;
import com.data.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
    }
    @Override
    public UserResponse getUserProfile(String username) {
        return mapToUserResponse(findUserByUsername(username));
    }
    @Override
    public UserResponse updateUserProfile(String username, UpdateUserRequest request) {
        User user = findUserByUsername(username);
        user.setEmail(request.getEmail());
        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .isActive(user.isActive())
                .roles(user.getRoles().stream().map(role -> role.getRoleName().name()).collect(Collectors.toSet()))
                .build();
    }
}
