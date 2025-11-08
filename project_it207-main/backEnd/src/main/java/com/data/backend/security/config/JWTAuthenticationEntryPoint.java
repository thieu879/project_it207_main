package com.data.backend.security.config;

import com.data.backend.model.dto.APIResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class JWTAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {

        Map<String, String> errorDetails = new HashMap<>();
        int status = HttpServletResponse.SC_FORBIDDEN;
        String message = "Access Denied";

        if (authException instanceof org.springframework.security.authentication.BadCredentialsException) {
            errorDetails.put("error", "Tài khoản hoặc mật khẩu không đúng.");
            status = HttpServletResponse.SC_UNAUTHORIZED;
            message = "Sai thông tin đăng nhập";
        } else if (authException instanceof org.springframework.security.authentication.InsufficientAuthenticationException) {
            errorDetails.put("error", "Yêu cầu đăng nhập để tiếp tục.");
            status = HttpServletResponse.SC_UNAUTHORIZED;
            message = "Chưa xác thực";
        } else if (authException.getCause() instanceof io.jsonwebtoken.ExpiredJwtException) {
            errorDetails.put("error", "JWT đã hết hạn, vui lòng đăng nhập lại.");
            status = HttpServletResponse.SC_UNAUTHORIZED;
            message = "Token hết hạn";
        } else if (authException.getCause() instanceof io.jsonwebtoken.SignatureException) {
            errorDetails.put("error", "Chữ ký token không hợp lệ.");
            status = HttpServletResponse.SC_UNAUTHORIZED;
            message = "Sai chữ ký JWT";
        } else {
            errorDetails.put("error", "Truy cập bị từ chối do thông tin xác thực không hợp lệ hoặc thiếu.");
        }

        APIResponse<Map<String, String>> apiResponse = APIResponse.<Map<String, String>>builder()
                .data(null)
                .message(message)
                .success(false)
                .build();

        response.setContentType("application/json");
        response.setStatus(status);
        objectMapper.writeValue(response.getOutputStream(), apiResponse);
    }
}
