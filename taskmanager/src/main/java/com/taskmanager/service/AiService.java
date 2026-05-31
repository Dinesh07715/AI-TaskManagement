package com.taskmanager.service;

import com.taskmanager.dto.request.AiRequest;
import com.taskmanager.dto.response.AiResponse;

public interface AiService {
    AiResponse generateTaskDetails(AiRequest request);
}
