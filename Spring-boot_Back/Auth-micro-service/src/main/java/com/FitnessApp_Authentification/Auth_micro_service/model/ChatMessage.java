// ChatMessage.java
package com.FitnessApp_Authentification.Auth_micro_service.model;

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
