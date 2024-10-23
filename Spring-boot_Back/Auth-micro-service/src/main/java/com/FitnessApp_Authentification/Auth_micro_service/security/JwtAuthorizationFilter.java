package com.FitnessApp_Authentification.Auth_micro_service.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.FitnessApp_Authentification.Auth_micro_service.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    
    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);  // Remove "Bearer " from the token
            try {
                // Extract user ID from the token
                Long userId = jwtUtil.extractUserId(token); 

                // Retrieve UserDetails based on userId
                UserDetails userDetails = userService.loadUserById(userId); 

                
                if (userDetails != null && jwtUtil.isTokenValid(token, userDetails)) {
                    
                    request.setAttribute("userId", userId);
                } else {
                    // Token is invalid, return unauthorized response
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
            } catch (Exception e) {
                // Handle token validation exceptions (like expired token, invalid signature, etc.)
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid token");
                return;
            }
        }

        
        filterChain.doFilter(request, response);
    }
}
