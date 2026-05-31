package com.taskmanager.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserDashboardResponse {
    private long myTasksCount;
    private long assignedTasksCount;
    private long inProgressTasksCount;
    private long completedTasksCount;
    private List<TaskResponse> recentTasks;
}
