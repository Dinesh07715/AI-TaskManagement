package com.taskmanager.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskmanager.dto.request.AiRequest;
import com.taskmanager.dto.response.AiResponse;
import com.taskmanager.entity.TaskPriority;
import com.taskmanager.exception.BadRequestException;
import com.taskmanager.service.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${app.gemini.api-key}")
    private String geminiApiKey;

    @Value("${app.gemini.api-url}")
    private String geminiApiUrl;

    @Override
public AiResponse generateTaskDetails(AiRequest request) {

    String prompt = buildPrompt(request.getTitle());

    Map<String, Object> requestBody = Map.of(
            "contents", new Object[]{
                    Map.of("parts", new Object[]{
                            Map.of("text", prompt)
                    })
            },
            "generationConfig", Map.of(
                    "temperature", 0.4,
                    "maxOutputTokens", 512
            )
    );

    try {

        String responseBody = webClient.post()
                .uri(geminiApiUrl + "?key=" + geminiApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return parseGeminiResponse(responseBody);

    } catch (WebClientResponseException e) {

        log.warn("Gemini unavailable. Using fallback response. Error: {}", e.getMessage());

        String title = request.getTitle().toLowerCase();

        if (title.contains("presentation")) {
            return AiResponse.builder()
                    .description("Create and organize presentation slides for client review.")
                    .priority(TaskPriority.HIGH)
                    .estimatedTime("4 Hours")
                    .build();
        }

        if (title.contains("report")) {
            return AiResponse.builder()
                    .description("Research, prepare, review and submit the required report.")
                    .priority(TaskPriority.MEDIUM)
                    .estimatedTime("1 Day")
                    .build();
        }

        if (title.contains("meeting")) {
            return AiResponse.builder()
                    .description("Prepare agenda, attend the meeting and document action items.")
                    .priority(TaskPriority.MEDIUM)
                    .estimatedTime("2 Hours")
                    .build();
        }

        return AiResponse.builder()
                .description("Plan, organize and complete the task with proper review and tracking.")
                .priority(TaskPriority.MEDIUM)
                .estimatedTime("2 Hours")
                .build();

    } catch (Exception e) {

        log.error("Error calling Gemini API: {}", e.getMessage());

        return AiResponse.builder()
                .description("Plan, organize and complete the task with proper review and tracking.")
                .priority(TaskPriority.MEDIUM)
                .estimatedTime("2 Hours")
                .build();
    }
}

    private String buildPrompt(String title) {
        return String.format("""
                You are a task management assistant. Based on the task title provided, generate task details in JSON format only.

                Task Title: "%s"

                Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
                {
                  "description": "A clear, concise description of what this task involves (2-3 sentences)",
                  "priority": "LOW or MEDIUM or HIGH",
                  "estimatedTime": "e.g., 2 hours, 1 day, 3 days"
                }
                """, title);
    }

    private AiResponse parseGeminiResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            String text = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            String cleanedJson = text.trim()
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            JsonNode parsed = objectMapper.readTree(cleanedJson);

            String priorityStr = parsed.path("priority").asText("MEDIUM").toUpperCase();
            TaskPriority priority;
            try {
                priority = TaskPriority.valueOf(priorityStr);
            } catch (IllegalArgumentException e) {
                priority = TaskPriority.MEDIUM;
            }

            return AiResponse.builder()
                    .description(parsed.path("description").asText("No description generated"))
                    .priority(priority)
                    .estimatedTime(parsed.path("estimatedTime").asText("Not estimated"))
                    .build();

        } catch (Exception e) {
            log.error("Error parsing Gemini response: {}", e.getMessage());
            return AiResponse.builder()
                    .description("Unable to generate description at this time.")
                    .priority(TaskPriority.MEDIUM)
                    .estimatedTime("Not estimated")
                    .build();
        }
    }
}
