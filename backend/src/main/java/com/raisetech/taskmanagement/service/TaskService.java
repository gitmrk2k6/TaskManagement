package com.raisetech.taskmanagement.service;

import com.raisetech.taskmanagement.dto.CreateTaskRequest;
import com.raisetech.taskmanagement.entity.Task;
import com.raisetech.taskmanagement.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> findTasks(String status, String priority) {
        if (status != null && priority != null) {
            return taskRepository.findByStatusAndPriority(status, priority);
        } else if (status != null) {
            return taskRepository.findByStatus(status);
        } else if (priority != null) {
            return taskRepository.findByPriority(priority);
        } else {
            return taskRepository.findAll();
        }
    }

    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(CreateTaskRequest req) {
        Task task = new Task();
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setPriority(req.getPriority());
        task.setStatus(req.getStatus() != null ? req.getStatus() : "todo");
        task.setDueDate(req.getDueDate());
        LocalDateTime now = LocalDateTime.now();
        task.setCreatedAt(now);
        task.setUpdatedAt(now);
        task.setPosition(nextPositionFor(task.getStatus()));
        return taskRepository.save(task);
    }

    private Integer nextPositionFor(String status) {
        return taskRepository.findByStatus(status).stream()
                .map(Task::getPosition)
                .filter(Objects::nonNull)
                .max(Integer::compareTo)
                .map(p -> p + 1)
                .orElse(0);
    }
}
