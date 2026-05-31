package com.taskmanager.service;

import com.taskmanager.dto.response.AdminDashboardResponse;
import com.taskmanager.dto.response.UserDashboardResponse;
import com.taskmanager.security.UserPrincipal;

public interface DashboardService {
    AdminDashboardResponse getAdminDashboard();
    UserDashboardResponse getUserDashboard(UserPrincipal currentUser);
}
