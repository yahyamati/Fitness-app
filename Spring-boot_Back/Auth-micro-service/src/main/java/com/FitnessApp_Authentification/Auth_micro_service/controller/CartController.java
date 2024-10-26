package com.FitnessApp_Authentification.Auth_micro_service.controller;

import com.FitnessApp_Authentification.Auth_micro_service.model.User;
import com.FitnessApp_Authentification.Auth_micro_service.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add") 
    public ResponseEntity<User> addToCart(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String exerciseId = request.get("exerciseId"); 
        User updatedUser = cartService.addToCart(userId, exerciseId);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/remove")
    public ResponseEntity<User> removeFromCart(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String exerciseId = request.get("exerciseId"); 
        User updatedUser = cartService.removeFromCart(userId, exerciseId);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/fetch")
    public ResponseEntity<Map<String, Integer>> fetchCart(@RequestParam String userId) {
        Map<String, Integer> cartData = cartService.fetchCart(userId);
        return ResponseEntity.ok(cartData);
    }
}
