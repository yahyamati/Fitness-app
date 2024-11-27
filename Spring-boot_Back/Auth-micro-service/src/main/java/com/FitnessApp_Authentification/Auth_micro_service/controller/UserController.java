package com.FitnessApp_Authentification.Auth_micro_service.controller;

import com.FitnessApp_Authentification.Auth_micro_service.model.User;
import com.FitnessApp_Authentification.Auth_micro_service.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import com.FitnessApp_Authentification.Auth_micro_service.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        try {
            userService.registerUser(user.getName(), user.getEmail(), user.getPassword());
            response.put("success", true);
            response.put("message", "User registered successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        UserDetails authenticatedUser = userService.authenticateUser(user.getEmail(), user.getPassword());

        if (authenticatedUser != null) {
            String userId = userService.getUserIdByEmail(user.getEmail());
            String userName = userService.getUserNameByEmail(user.getEmail());
            String token = jwtUtil.generateToken(authenticatedUser, userId,userName);
            response.put("success", true);
            response.put("token", token);
            response.put("userId", userId);
            response.put("name", userName);

            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(401).body(response);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Assuming UserService has a method to get all users
            Iterable<User> users = userService.getAllUsers();
            response.put("success", true);
            response.put("users", users);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch users: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }



 

    @PostMapping("/oauth2/login")
    public ResponseEntity<Map<String, Object>> generateTokenFromOAuth2(@RequestBody OAuth2AuthenticationToken authentication) {
        Map<String, Object> response = new HashMap<>();
        try {
            OAuth2User oauth2User = authentication.getPrincipal();
            Map<String, Object> attributes = oauth2User.getAttributes();
            
            String email = attributes.get("email").toString();
            String name = attributes.get("name").toString();
            
            // Register or update the user
            User user = userService.handleOAuth2User(email, name);
            
            // Generate JWT token
            String token = jwtUtil.generateTokenFromOAuth2(authentication);
            
            response.put("success", true);
            response.put("token", token);
            response.put("user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName(),
                "cartData", user.getCartData()
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Authentication failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }




@RequestMapping("/oauth2/callback")
public String handleGoogleCallback(@RequestParam String code) {
    // Process the callback from Google
    return "redirect:/home";
}


}

