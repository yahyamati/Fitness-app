package com.FitnessApp_Authentification.Auth_micro_service.config;

import com.FitnessApp_Authentification.Auth_micro_service.security.JwtAuthorizationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthorizationFilter jwtAuthorizationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF for stateless APIs
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults()) // Default CORS configuration
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(
                    "/api/users/login", 
                    "/api/users/register",
                    "/api/users/all", 
                    "/api/chat/questions",
                    "/api/chat/message",
                    "/api/chat/result",
                    "/api/chat/restart",
                    "/api/test-token",
                    "/api/cart/add",
                    "/api/cart/remove",
                    "/api/cart/fetch"
                                   
                ).permitAll()
                // Secure all other endpoints
                .anyRequest().authenticated()
            )
         
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // Add JWT filter to process tokens
            .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
