package com.FitnessApp_Authentification.Auth_micro_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtUtil {

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration;

    @Value("${security.jwt.refresh-token.expiration-time}")
    private long refreshExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractName(String token) {
        return extractClaim(token, claims -> claims.get("name", String.class));
    }

    public String extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", String.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails, String userId , String name) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", userId);
        extraClaims.put("name", name);
        return buildToken(extraClaims, userDetails.getUsername(), jwtExpiration);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails.getUsername(), refreshExpiration);
    }

    public String generateTokenFromOAuth2(OAuth2AuthenticationToken authentication) {
        // Extract details from the OAuth2 token
        Map<String, Object> attributes = authentication.getPrincipal().getAttributes();
        
        // Retrieve user details (ensure these keys exist in the OAuth2 provider's response)
        String username = authentication.getName(); // Typically the email or unique identifier
        String userId = attributes.getOrDefault("sub", "").toString(); // 'sub' represents the user ID in most OAuth2 providers
        String name = attributes.getOrDefault("name", "").toString(); // 'name' is often included in the response
    
        // Validate essential attributes
        if (userId.isEmpty() || username.isEmpty()) {
            throw new IllegalArgumentException("Invalid OAuth2 token: Missing user information");
        }
    
        // Add additional claims to the JWT token
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", userId);
        extraClaims.put("name", name);
    
        // Generate the JWT token using your utility method
        return buildToken(extraClaims, username, jwtExpiration);
    }
    

    private String buildToken(Map<String, Object> extraClaims, String username, long expiration) {
        // Get current date and expiration time
        Date now = new Date(System.currentTimeMillis());
        Date expirationDate = new Date(System.currentTimeMillis() + expiration);

        // Create and return the JWT token
        return Jwts.builder()
                .setClaims(extraClaims) // Add extra claims (e.g., userId, name)
                .setSubject(username)   // Set the subject (username or email)
                .setIssuedAt(now)       // Set the issued date
                .setExpiration(expirationDate) // Set the expiration date
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // Sign with secret key
                .compact(); // Generate the JWT token as a string
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
        } catch (Exception e) {
            System.out.println("Token validation error: " + e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
