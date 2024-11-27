package com.FitnessApp_Authentification.Auth_micro_service.service;

import com.FitnessApp_Authentification.Auth_micro_service.model.User;
import com.FitnessApp_Authentification.Auth_micro_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.AuthProvider;
import java.util.Collections;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void registerUser(String name, String email, String password) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); 
        userRepository.save(user);
    }

    public UserDetails authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) { 
            return org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPassword())
                    .authorities(Collections.emptyList()) 
                    .build();
        }
        return null; 
    }

    public String getUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email);
        return user != null ? user.getId() : null; 
    }
    

    public String getUserNameByEmail(String email) {      
        User user = userRepository.findByEmail(email);
        return user.getName();  
    }

    public UserDetails loadUserById(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPassword())
                    .authorities(Collections.emptyList()) 
                    .build();
        } else {
            throw new UsernameNotFoundException("User not found");
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(Collections.emptyList()) 
                .build();
    }

    public Iterable<User> getAllUsers() {
        return userRepository.findAll();  
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User handleOAuth2User(String email, String name) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setProvider("GOOGLE");
            user.setEmailVerified(true);
        } else {
            // Update existing user's name if it has changed
            user.setName(name);
        }
        return userRepository.save(user);
    }
}
