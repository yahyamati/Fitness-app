// ChatController.java
package com.fitness.backend_spring.controller;

import com.fitness.backend_spring.model.ChatMessage;
import com.fitness.backend_spring.service.ChatService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private int step = 0;
    private final String[] questions = {
            "What is your gender? (Male, Female)",
            "How experienced are you? (Beginner, Intermediate, Advanced)",
            "How much do you weigh?",
            "Which part would you like to work out today?"
    };
    private final Map<String, String> userData = new HashMap<>();

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // New endpoint to get questions
    @GetMapping("/questions")
    public Mono<String[]> getQuestions() {
        return Mono.just(questions);
    }

    @PostMapping("/message")
    public Mono<Map<String, String>> handleMessage(@RequestBody ChatMessage chatMessage) {
        try {
            if (step < questions.length) {
                String key = switch (step) {
                    case 0 -> "gender";
                    case 1 -> "experience";
                    case 2 -> "weight";
                    case 3 -> "workoutPart";
                    default -> "";
                };
                userData.put(key, chatMessage.getText());
    
                step++;
                if (step < questions.length) {
                    return Mono.just(Map.of("message", questions[step]));
                } else {
                    return chatService.getExerciseSuggestions(userData, userData.get("workoutPart"))
                            .map(suggestions -> Map.of("suggestions", suggestions));
                }
            } else {
                return Mono.just(Map.of("message", "All questions have been answered. Please restart the session."));
            }
        } catch (Exception e) {
            System.err.println("Error in handleMessage: " + e.getMessage());
            return Mono.just(Map.of("message", "An error occurred while processing your request."));
        }
    }

    @GetMapping("/result")
    public Mono<String> getResult() {
        if (step == questions.length) {
            return chatService.getExerciseSuggestions(userData, userData.get("workoutPart"))
                .doOnError(e -> System.err.println("Error fetching suggestions: " + e.getMessage()))
                .switchIfEmpty(Mono.just("No suggestions available."));
        } else {
            return Mono.just("Please answer all questions before getting results.");
        }
    }
    


    @PostMapping("/restart")
    public Mono<String> restart() {
        step = 0;
        userData.clear();
        return Mono.just("Session restarted. " + questions[step]);
    }
}
