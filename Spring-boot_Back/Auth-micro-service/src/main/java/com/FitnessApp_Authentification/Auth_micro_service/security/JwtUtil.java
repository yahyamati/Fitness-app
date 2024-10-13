package com.FitnessApp_Authentification.Auth_micro_service.security;

import java.security.Signature;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureAlgorithm;

@Component
public class JwtUtil {
   
   private String secretKey = "thanks africa";
   private long expirationTime = 1000 * 60 * 60;

   public String generateToken(String username) {
      Map<String, Object> claims = new HashMap<>();
      return createToken(claims, username);
   }

   public String createToken(Map<String, Object> claims, String subject) {


      Date now = new Date();
      Date expiryDate = new Date(now.getTime() + expirationTime); // +1 hour to expiration

      JwtBuilder builder = Jwts.builder()
            .claims(claims).subject(subject).issuedAt(now).expiration(expiryDate)
            .signWith(SignatureAlgorithm.class, secretKey);

      return builder.compact();
   }

   public Boolean validateToken(String token, String username) {
      final String extractedUsername = extractUsername(token);
      return (extractedUsername.equals(username) && !isTokenExpired(token));
   }

   public String extractUsername(String token) {
      return extractAllClaims(token).getSubject();
   }

   private Claims extractAllClaims(String token) {
      return Jwts.parser()
            .verifyWith(secretKey)
            .parseClaimsJws(token)
            .getBody();
   }

   private Boolean isTokenExpired(String token) {
      return extractAllClaims(token).getExpiration().before(new Date());
   }

}
