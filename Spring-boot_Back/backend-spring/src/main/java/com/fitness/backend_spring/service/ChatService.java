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
        // Construct the message for the API request
        String suggestionsMessage = String.format(
            "Suggest 5 exercises for a %s, who is %s, weighs %s, and wants to work out %s. " +
            "Without explanation, and give me only how many sets to do.",
            userData.get("gender"),
            userData.get("experience"),
            userData.get("weight"),
            workoutPart
        );

        // Log the suggestions message for debugging
        System.out.println("Suggestions Message: " + suggestionsMessage);

        return webClient.post()
            .uri("/conversationgpt4-2") // Ensure this endpoint is correct
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
            .onStatus(status -> status.isError(), response -> {
                return response.bodyToMono(String.class)
                    .flatMap(errorResponse -> {
                        System.err.println("Error response from API: " + errorResponse);
                        return Mono.error(new RuntimeException("API call failed: " + errorResponse));
                    });
            })
            .bodyToMono(ApiResponse.class) // Ensure the ApiResponse class structure matches the expected response
            .map(ApiResponse::getResult) // Ensure that the ApiResponse has a method to retrieve the result
            .doOnSuccess(apiResponse -> System.out.println("API Response: " + apiResponse))
            .doOnError(e -> {
                System.err.println("Error fetching suggestions: " + e.getMessage());
                e.printStackTrace(); // Log the stack trace for debugging
            })
            .onErrorReturn("Error: Could not get exercise suggestions.");
    }
}