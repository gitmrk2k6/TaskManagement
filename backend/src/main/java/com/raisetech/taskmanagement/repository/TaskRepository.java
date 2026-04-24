package com.raisetech.taskmanagement.repository;

import com.raisetech.taskmanagement.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(String status);

    List<Task> findByPriority(String priority);

    List<Task> findByStatusAndPriority(String status, String priority);
}
