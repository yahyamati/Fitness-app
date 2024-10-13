package com.FitnessApp_Authentification.Auth_micro_service.userController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.FitnessApp_Authentification.Auth_micro_service.repository.UserRepo;
import com.FitnessApp_Authentification.Auth_micro_service.security.JwtUtil;
import com.FitnessApp_Authentification.Auth_micro_service.service.userService;

import model.entity.User;

@RestController
public class UserController {


   @Autowired
   private userService userSR;

   @Autowired
   private UserRepo userREPO;

   @Autowired
   private PasswordEncoder passwordEN;

   @Autowired
   private JwtUtil jwtUtil;

   @PostMapping("/register")
   public ResponseEntity<String> register(@RequestBody User user) {

      user.setPassword(passwordEN.encode(user.getPassword()));
      userREPO.save(user);
      return ResponseEntity.ok("User Registred seccessfully");
   }


   @PostMapping("/authenticate")
   public ResponseEntity<String> authenticate(@RequestBody User user){

      User findUser = userREPO.findByUsername(user.getEmail());
      if (findUser != null && passwordEN.matches(user.getPassword(), findUser.getPassword())) {
         String token = jwtUtil.generateToken(user.getEmail());
         return ResponseEntity.ok(token);
      } else {
         return ResponseEntity.status(401).body("invalide email and password");
      }

   }








}