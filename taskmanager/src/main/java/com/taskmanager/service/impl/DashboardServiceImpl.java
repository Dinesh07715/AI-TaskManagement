package com.taskmanager.service.impl;

import com.taskmanager.dto.response.AdminDashboardResponse;
import com.taskmanager.dto.response.TaskResponse;
import com.taskmanager.dto.response.UserDashboardResponse;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.entity.User;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.security.UserPrincipal;
import com.taskmanager.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskServiceImpl taskService;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        long totalUsers = userRepository.count();
        long totalTasks = taskRepository.count();
        long pendingTasks = taskRepository.countByStatus(TaskStatus.TODO);
        long inProgressTasks = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);
        long completedTasks = taskRepository.countByStatus(TaskStatus.DONE);

        List<TaskResponse> recentTasks = taskRepository.findRecentTasks()
                .stream()
                .map(taskService::mapToTaskResponse)
                .toList();

        List<AdminDashboardResponse.UserTaskSummary> taskAssignmentOverview =
                userRepository.findAll().stream()
                        .map(user -> AdminDashboardResponse.UserTaskSummary.builder()
                                .userId(user.getId())
                                .userName(user.getName())
                                .assignedTaskCount(taskRepository.countByAssignedTo(user))
                                .completedTaskCount(taskRepository.countByAssignedToAndStatus(user, TaskStatus.DONE))
                                .build())
                        .filter(summary -> summary.getAssignedTaskCount() > 0)
                        .toList();

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalTasks(totalTasks)
                .pendingTasks(pendingTasks)
                .inProgressTasks(inProgressTasks)
                .completedTasks(completedTasks)
                .recentTasks(recentTasks)
                .taskAssignmentOverview(taskAssignmentOverview)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserDashboardResponse getUserDashboard(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        List<Task> createdTasks = taskRepository.findByCreatedBy(user);
        List<Task> assignedTasks = taskRepository.findByAssignedTo(user);
        List<Task> allRelatedTasks = taskRepository.findAllRelatedToUser(user);

        long myTasksCount = createdTasks.size();
        long assignedTasksCount = assignedTasks.size();
        long inProgressTasksCount = allRelatedTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS)
                .count();
        long completedTasksCount = allRelatedTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE)
                .count();

        List<TaskResponse> recentTasks = allRelatedTasks.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(taskService::mapToTaskResponse)
                .toList();

        return UserDashboardResponse.builder()
                .myTasksCount(myTasksCount)
                .assignedTasksCount(assignedTasksCount)
                .inProgressTasksCount(inProgressTasksCount)
                .completedTasksCount(completedTasksCount)
                .recentTasks(recentTasks)
                .build();
    }
}
