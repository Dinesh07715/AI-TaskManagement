package com.taskmanager.controller;

import com.taskmanager.dto.response.AdminDashboardResponse;
import com.taskmanager.dto.response.ApiResponse;
import com.taskmanager.dto.response.UserDashboardResponse;
import com.taskmanager.security.UserPrincipal;
import com.taskmanager.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard analytics APIs")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get admin dashboard stats")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getAdminDashboard() {
        AdminDashboardResponse dashboard = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard retrieved successfully", dashboard));
    }

    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user dashboard stats")
    public ResponseEntity<ApiResponse<UserDashboardResponse>> getUserDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        UserDashboardResponse dashboard = dashboardService.getUserDashboard(currentUser);
        return ResponseEntity.ok(ApiResponse.success("User dashboard retrieved successfully", dashboard));
    }
}
