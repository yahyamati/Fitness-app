package com.fitness.backend_spring.service;

import com.fitness.backend_spring.model.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {
    private final WebClient webClient;

    @Value("${rapidapi.host}")
    private String rapidApiHost;

    @Value("${rapidapi.key}")
    private String rapidApiKey;

    public ChatService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://chatgpt-42.p.rapidapi.com").build();
    }

    public Mono<String> getExerciseSuggestions(Map<String, String> userData, String workoutPart) {
        String suggestionsMessage = String.format(
            "Suggest 5 exercises for a %s, who is %s, weighs %s, and wants to work out %s. " +
            "Without explanation, and give me only how many sets to do.",
            userData.get("gender"),
            userData.get("experience"),
            userData.get("weight"),
            workoutPart
        );
    
        return webClient.post()
            .uri("/conversationgpt4-2")
            .header("Content-Type", "application/json")
            .header("x-rapidapi-host", rapidApiHost)
            .header("x-rapidapi-key", rapidApiKey)
            .bodyValue(Map.of(
                    "messages", List.of(Map.of("role", "user", "content", suggestionsMessage)),
                    "system_prompt", "",
                    "temperature", 0.9,
                    "top_k", 5
            ))
            .retrieve()
            .bodyToMono(ApiResponse.class)
            .map(ApiResponse::getResult)
            .doOnError(e -> {
                System.err.println("Error fetching suggestions: " + e.getMessage());
                e.printStackTrace();
            })
            .onErrorReturn("Error: Could not get exercise suggestions.");
    }
    
}