// ChatMessage.java
package com.fitness.backend_spring.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class ChatMessage {
    private String sender; 
    private String text;
}
