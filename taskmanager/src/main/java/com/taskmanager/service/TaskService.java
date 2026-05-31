package com.taskmanager.service;

import com.taskmanager.dto.request.AssignTaskRequest;
import com.taskmanager.dto.request.TaskRequest;
import com.taskmanager.dto.request.UpdateStatusRequest;
import com.taskmanager.dto.response.TaskResponse;
import com.taskmanager.security.UserPrincipal;

import java.util.List;

public interface TaskService {
    TaskResponse createTask(TaskRequest request, UserPrincipal currentUser);
    List<TaskResponse> getAllTasks(UserPrincipal currentUser);
    TaskResponse getTaskById(Long id, UserPrincipal currentUser);
    TaskResponse updateTask(Long id, TaskRequest request, UserPrincipal currentUser);
    void deleteTask(Long id, UserPrincipal currentUser);
    TaskResponse updateStatus(Long id, UpdateStatusRequest request, UserPrincipal currentUser);
    TaskResponse assignTask(Long id, AssignTaskRequest request, UserPrincipal currentUser);
}
