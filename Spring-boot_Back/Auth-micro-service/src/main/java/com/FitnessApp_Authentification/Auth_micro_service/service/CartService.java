package com.FitnessApp_Authentification.Auth_micro_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FitnessApp_Authentification.Auth_micro_service.model.User;
import com.FitnessApp_Authentification.Auth_micro_service.repository.UserRepository;

import java.util.Map;

@Service
public class CartService {

    @Autowired
    private UserRepository userRepository;

    // Add item to cart (only adds once)
    public User addToCart(String userId, String itemId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Integer> cartData = user.getCartData();
        
        // Add the item to the cart only if it's not already present
        if (!cartData.containsKey(itemId)) {
            cartData.put(itemId, 1); // Set initial quantity to 1
            user.setCartData(cartData);
            return userRepository.save(user);
        } else {
            throw new RuntimeException("Item already in cart");
        }
    }

    // Remove item from cart completely
    public User removeFromCart(String userId, String itemId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Integer> cartData = user.getCartData();

        // Check if the item exists in the cart
        if (cartData.containsKey(itemId)) {
            // Remove the item from the cart
            cartData.remove(itemId);
            user.setCartData(cartData);
            return userRepository.save(user);
        } else {
            throw new RuntimeException("Item not found in cart");
        }
    }

    // Fetch cart data
    public Map<String, Integer> fetchCart(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getCartData();
    }
}
