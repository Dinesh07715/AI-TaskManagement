package com.taskmanager.dto.response;

import com.taskmanager.entity.TaskPriority;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AiResponse {
    private String description;
    private TaskPriority priority;
    private String estimatedTime;
}
