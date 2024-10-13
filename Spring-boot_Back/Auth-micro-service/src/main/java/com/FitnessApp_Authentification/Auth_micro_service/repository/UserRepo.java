package com.FitnessApp_Authentification.Auth_micro_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import model.entity.User;

public interface UserRepo extends JpaRepository<User, Long> {
   User findByUsername(String email);
}
