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

   
    @GetMapping("/questions")
    public Mono<String[]> getQuestions() {
        return Mono.just(questions);
    }

    @PostMapping("/message")
    public Mono<Map<String, String>> handleMessage(@RequestBody ChatMessage chatMessage) {
        try {
            if (step < questions.length) {
                String userInput = chatMessage.getText().trim().toLowerCase();

                
                switch (step) {
                    case 0 -> {
                        if (!userInput.equals("male") && !userInput.equals("female")) {
                            return Mono.just(Map.of("message", "Invalid input. Please answer with Male or Female."));
                        }
                        userData.put("gender", userInput);
                    }
                    case 1 -> {
                        if (!userInput.equals("beginner") && !userInput.equals("intermediate") && !userInput.equals("advanced")) {
                            return Mono.just(Map.of("message", "Invalid input. Please choose from Beginner, Intermediate, or Advanced."));
                        }
                        userData.put("experience", userInput);
                    }
                    case 2 -> {
                        try {
                            Double.parseDouble(userInput);
                            userData.put("weight", userInput);
                        } catch (NumberFormatException e) {
                            return Mono.just(Map.of("message", "Invalid input. Please enter a valid number for weight."));
                        }
                    }
                    case 3 -> userData.put("workoutPart", userInput);
                }

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
            e.printStackTrace();
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
        return Mono.just( questions[step]);
    }
}
