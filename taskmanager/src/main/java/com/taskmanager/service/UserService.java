package com.taskmanager.service;

import com.taskmanager.dto.request.UpdateUserRequest;
import com.taskmanager.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    UserResponse updateUser(Long id, UpdateUserRequest request);
    void deleteUser(Long id);
}
