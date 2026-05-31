package com.taskmanager.controller;

import com.taskmanager.dto.request.AiRequest;
import com.taskmanager.dto.response.AiResponse;
import com.taskmanager.dto.response.ApiResponse;
import com.taskmanager.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@Tag(name = "AI Assistant", description = "AI-powered task generation APIs")
public class AiController {

    private final AiService aiService;

    @PostMapping("/generate")
    @Operation(summary = "Generate task details using AI (Gemini)",
               description = "Provide a task title and receive AI-generated description, priority, and estimated time")
    public ResponseEntity<ApiResponse<AiResponse>> generateTaskDetails(
            @Valid @RequestBody AiRequest request) {
        AiResponse response = aiService.generateTaskDetails(request);
        return ResponseEntity.ok(ApiResponse.success("Task details generated successfully", response));
    }
}
