package com.taskmanager.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminDashboardResponse {
    private long totalUsers;
    private long totalTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long completedTasks;
    private List<TaskResponse> recentTasks;
    private List<UserTaskSummary> taskAssignmentOverview;

    @Data
    @Builder
    public static class UserTaskSummary {
        private Long userId;
        private String userName;
        private long assignedTaskCount;
        private long completedTaskCount;
    }
}
