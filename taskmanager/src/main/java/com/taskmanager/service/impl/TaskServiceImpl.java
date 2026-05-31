package com.taskmanager.service.impl;

import com.taskmanager.dto.request.AssignTaskRequest;
import com.taskmanager.dto.request.TaskRequest;
import com.taskmanager.dto.request.UpdateStatusRequest;
import com.taskmanager.dto.response.TaskResponse;
import com.taskmanager.entity.Role;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.entity.User;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.exception.UnauthorizedException;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.security.UserPrincipal;
import com.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public TaskResponse createTask(TaskRequest request, UserPrincipal currentUser) {
        User creator = getUserEntity(currentUser.getId());

        User assignedTo = null;
        if (request.getAssignedToId() != null) {
            if (currentUser.getAuthorities().stream()
                    .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                throw new UnauthorizedException("Only admins can assign tasks to others during creation");
            }
            assignedTo = getUserEntity(request.getAssignedToId());
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .dueDate(request.getDueDate())
                .estimatedTime(request.getEstimatedTime())
                .createdBy(creator)
                .assignedTo(assignedTo)
                .build();

        return mapToTaskResponse(taskRepository.save(task));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(UserPrincipal currentUser) {
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return taskRepository.findAll().stream()
                    .map(this::mapToTaskResponse)
                    .toList();
        }

        User user = getUserEntity(currentUser.getId());
        return taskRepository.findAllRelatedToUser(user).stream()
                .map(this::mapToTaskResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id, UserPrincipal currentUser) {
        Task task = getTaskEntity(id);
        verifyAccess(task, currentUser);
        return mapToTaskResponse(task);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request, UserPrincipal currentUser) {
        Task task = getTaskEntity(id);
        verifyOwnerOrAdmin(task, currentUser);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        task.setDueDate(request.getDueDate());
        task.setEstimatedTime(request.getEstimatedTime());

        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (request.getAssignedToId() != null && isAdmin) {
            task.setAssignedTo(getUserEntity(request.getAssignedToId()));
        }

        return mapToTaskResponse(taskRepository.save(task));
    }

    @Override
    @Transactional
    public void deleteTask(Long id, UserPrincipal currentUser) {
        Task task = getTaskEntity(id);
        verifyOwnerOrAdmin(task, currentUser);
        taskRepository.deleteById(id);
    }

    @Override
    @Transactional
    public TaskResponse updateStatus(Long id, UpdateStatusRequest request, UserPrincipal currentUser) {
        Task task = getTaskEntity(id);
        verifyAccess(task, currentUser);
        task.setStatus(request.getStatus());
        return mapToTaskResponse(taskRepository.save(task));
    }

    @Override
    @Transactional
    public TaskResponse assignTask(Long id, AssignTaskRequest request, UserPrincipal currentUser) {
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            throw new UnauthorizedException("Only admins can assign tasks");
        }

        Task task = getTaskEntity(id);
        User assignee = getUserEntity(request.getUserId());
        task.setAssignedTo(assignee);
        return mapToTaskResponse(taskRepository.save(task));
    }

    private Task getTaskEntity(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
    }

    private User getUserEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    private void verifyAccess(Task task, UserPrincipal currentUser) {
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) return;

        boolean isCreator = task.getCreatedBy().getId().equals(currentUser.getId());
        boolean isAssignee = task.getAssignedTo() != null &&
                task.getAssignedTo().getId().equals(currentUser.getId());

        if (!isCreator && !isAssignee) {
            throw new UnauthorizedException("You don't have access to this task");
        }
    }

    private void verifyOwnerOrAdmin(Task task, UserPrincipal currentUser) {
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) return;

        if (!task.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only modify your own tasks");
        }
    }

    public TaskResponse mapToTaskResponse(Task task) {
        TaskResponse.UserSummary createdBy = TaskResponse.UserSummary.builder()
                .id(task.getCreatedBy().getId())
                .name(task.getCreatedBy().getName())
                .email(task.getCreatedBy().getEmail())
                .build();

        TaskResponse.UserSummary assignedTo = null;
        if (task.getAssignedTo() != null) {
            assignedTo = TaskResponse.UserSummary.builder()
                    .id(task.getAssignedTo().getId())
                    .name(task.getAssignedTo().getName())
                    .email(task.getAssignedTo().getEmail())
                    .build();
        }

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .estimatedTime(task.getEstimatedTime())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .createdBy(createdBy)
                .assignedTo(assignedTo)
                .build();
    }
}
