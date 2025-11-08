package com.data.backend.service.auth;

import com.data.backend.model.constants.ERole;
import com.data.backend.model.dto.request.LoginRequest;
import com.data.backend.model.dto.request.SignupRequest;
import com.data.backend.model.dto.response.JWTResponse;
import com.data.backend.model.entity.Role;
import com.data.backend.model.entity.User;
import com.data.backend.repository.RoleRepository;
import com.data.backend.repository.UserRepository;
import com.data.backend.security.jwt.JWTProvider;
import com.data.backend.security.principal.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JWTProvider jwtProvider;

    @Override
    public void register(SignupRequest signupRequest) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setActive(true);

        Set<String> strRoles = signupRequest.getRole();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByRoleName(ERole.ROLE_USER).orElseThrow(() -> new RuntimeException("Error: Role 'USER' is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                if ("admin".equalsIgnoreCase(role)) {
                    Role adminRole = roleRepository.findByRoleName(ERole.ROLE_ADMIN).orElseThrow(() -> new RuntimeException("Error: Role 'ADMIN' is not found."));
                    roles.add(adminRole);
                } else {
                    Role userRole = roleRepository.findByRoleName(ERole.ROLE_USER).orElseThrow(() -> new RuntimeException("Error: Role 'USER' is not found."));
                    roles.add(userRole);
                }
            });
        }
        user.setRoles(roles);
        userRepository.save(user);
    }

    @Override
    public JWTResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String jwt = jwtProvider.generateToken(userDetails.getUsername());
        return JWTResponse.builder()
                .token(jwt)
                .username(userDetails.getUsername())
                .email(userDetails.getUser().getEmail())
                .enabled(userDetails.isEnabled())
                .isActive(userDetails.isEnabled())
                .authorities(userDetails.getAuthorities())
                .build();
    }
}
