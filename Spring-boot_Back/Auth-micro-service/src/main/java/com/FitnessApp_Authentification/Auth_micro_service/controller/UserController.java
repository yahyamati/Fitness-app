package com.FitnessApp_Authentification.Auth_micro_service.controller;

import com.FitnessApp_Authentification.Auth_micro_service.model.User;
import com.FitnessApp_Authentification.Auth_micro_service.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.FitnessApp_Authentification.Auth_micro_service.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        // Handle user existence check here if needed
        userService.registerUser(user.getName(), user.getEmail(), user.getPassword());
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        // Authenticate user and get UserDetails
        UserDetails authenticatedUser = userService.authenticateUser(user.getEmail(), user.getPassword());
        
        if (authenticatedUser != null) { // Check if authenticatedUser is not null
            // You might want to extract the userId from the authenticatedUser
            String userId = userService.getUserIdByEmail(user.getEmail());
            String token = jwtUtil.generateToken(authenticatedUser, userId); // Pass userId to generateToken
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}
