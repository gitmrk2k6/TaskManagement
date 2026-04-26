package com.raisetech.taskmanagement.service;

import com.raisetech.taskmanagement.dto.CreateTaskRequest;
import com.raisetech.taskmanagement.dto.UpdateTaskRequest;
import com.raisetech.taskmanagement.entity.Task;
import com.raisetech.taskmanagement.exception.NotFoundException;
import com.raisetech.taskmanagement.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    @Transactional
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

    @Transactional
    public Task updateTask(Long id, UpdateTaskRequest req) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found: " + id));

        String oldStatus = task.getStatus();
        boolean orderChanged = false;

        if (req.getTitle() != null) { task.setTitle(req.getTitle()); }
        if (req.getDescription() != null) { task.setDescription(req.getDescription()); }
        if (req.getPriority() != null) { task.setPriority(req.getPriority()); }
        if (req.getStatus() != null) {
            if (!req.getStatus().equals(oldStatus)) { orderChanged = true; }
            task.setStatus(req.getStatus());
        }
        if (req.getDueDate() != null) { task.setDueDate(req.getDueDate()); }
        if (req.getPosition() != null) {
            orderChanged = true;
        }
        task.setUpdatedAt(LocalDateTime.now());
        taskRepository.save(task);

        if (orderChanged) {
            reorderWithMove(task, oldStatus, req.getPosition());
        }
        return taskRepository.findById(id).orElseThrow();
    }

    private Integer nextPositionFor(String status) {
        return taskRepository.findByStatus(status).stream()
                .map(Task::getPosition)
                .filter(Objects::nonNull)
                .max(Integer::compareTo)
                .map(p -> p + 1)
                .orElse(0);
    }

    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found: " + id));
        String status = task.getStatus();
        taskRepository.deleteById(id);
        List<Task> col = getSortedColumn(status);
        for (int i = 0; i < col.size(); i++) {
            col.get(i).setPosition(i);
        }
        taskRepository.saveAll(col);
    }

    private List<Task> getSortedColumn(String status) {
        List<Task> col = taskRepository.findByStatus(status);
        col.sort(Comparator.comparingInt(t -> t.getPosition() == null ? Integer.MAX_VALUE : t.getPosition()));
        return col;
    }

    private void reorderWithMove(Task movedTask, String oldStatus, Integer targetIndex) {
        String newStatus = movedTask.getStatus();
        boolean crossColumn = !oldStatus.equals(newStatus);

        List<Task> sourceCol = getSortedColumn(oldStatus);
        sourceCol.removeIf(t -> t.getId().equals(movedTask.getId()));

        List<Task> targetCol = crossColumn ? getSortedColumn(newStatus) : sourceCol;

        int insertAt = (targetIndex == null) ? targetCol.size()
                : Math.min(targetIndex, targetCol.size());
        targetCol.add(insertAt, movedTask);

        for (int i = 0; i < targetCol.size(); i++) {
            targetCol.get(i).setPosition(i);
        }
        taskRepository.saveAll(targetCol);

        if (crossColumn) {
            for (int i = 0; i < sourceCol.size(); i++) {
                sourceCol.get(i).setPosition(i);
            }
            taskRepository.saveAll(sourceCol);
        }
    }
}
