package com.FitnessApp_Authentification.Auth_micro_service.repository;

import com.FitnessApp_Authentification.Auth_micro_service.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    Optional<User> findById(Long userId);
}
