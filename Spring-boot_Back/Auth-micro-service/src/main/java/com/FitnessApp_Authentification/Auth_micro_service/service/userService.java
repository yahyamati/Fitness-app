package com.FitnessApp_Authentification.Auth_micro_service.service;

import java.lang.StackWalker.Option;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties.Jwt;
import org.springframework.stereotype.Service;

import com.FitnessApp_Authentification.Auth_micro_service.repository.UserRepo;
import com.FitnessApp_Authentification.Auth_micro_service.security.JwtUtil;

import model.entity.User;



@Service
public class userService {




   @Autowired
   private UserRepo user_repo;

   @Autowired
   private JwtUtil jwtUtil;

   public String authenticate(String username, String password) {
      User userAth = this.user_repo.findByUsername(username);
      if (userAth.getPassword().equals(password)) {
      return jwtUtil.generateToken(username);
   } else {
      return "NOTHING";}
   }



}
