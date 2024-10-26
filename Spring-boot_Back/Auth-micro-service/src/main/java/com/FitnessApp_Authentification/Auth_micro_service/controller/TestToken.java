package com.FitnessApp_Authentification.Auth_micro_service.controller;

import com.FitnessApp_Authentification.Auth_micro_service.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import com.FitnessApp_Authentification.Auth_micro_service.service.UserService;

@RestController
public class TestToken {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @GetMapping("/api/test-token")
    public String testToken(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            try {
                String userId = jwtUtil.extractUserId(token);
                if (userId != null) {
                    UserDetails userDetails = userService.loadUserById(userId);
                    if (jwtUtil.isTokenValid(token, userDetails)) {
                        return "Token is valid";
                    } else {
                        return "Token is invalid";
                    }
                }
            } catch (Exception e) {
                return "Token is invalid: " + e.getMessage();
            }
        }
        return "Invalid token format";
    }
}
