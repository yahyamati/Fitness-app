// ChatMessage.java
package com.fitness.backend_spring.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor // To handle cases where you don't need to pass all the fields in the constructor
public class ChatMessage {
    private String sender; // Optional: you might remove it if not needed
    private String text;
}
