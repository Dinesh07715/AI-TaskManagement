package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByCreatedBy(User user);

    List<Task> findByAssignedTo(User user);

    List<Task> findByCreatedByOrAssignedTo(User createdBy, User assignedTo);

    long countByStatus(TaskStatus status);

    long countByAssignedTo(User user);

    long countByAssignedToAndStatus(User user, TaskStatus status);

    @Query("SELECT t FROM Task t WHERE t.createdBy = :user OR t.assignedTo = :user")
    List<Task> findAllRelatedToUser(@Param("user") User user);

    @Query("SELECT t FROM Task t ORDER BY t.createdAt DESC LIMIT 10")
    List<Task> findRecentTasks();
}
