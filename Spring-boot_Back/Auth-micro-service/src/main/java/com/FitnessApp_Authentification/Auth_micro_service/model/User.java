package com.FitnessApp_Authentification.Auth_micro_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;

@Document(collection = "users")
public class User {

    @Id
    private String id;  

    private String name;
    private String email;
    private String password;
    
    private Map<String, Integer> cartData = new HashMap<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Map<String, Integer> getCartData() {
        return cartData;
    }

    public void setCartData(Map<String, Integer> cartData) {
        this.cartData = cartData;
    }
}
