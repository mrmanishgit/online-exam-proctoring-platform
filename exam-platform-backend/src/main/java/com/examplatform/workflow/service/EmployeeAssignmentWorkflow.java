package com.examplatform.workflow.service;

import com.examplatform.entity.*;
import com.examplatform.enums.Role;
import com.examplatform.repository.*;
import com.examplatform.workflow.dto.AssignExamRequest;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EmployeeAssignmentWorkflow {

    private final UserRepository users;
    private final ExamRepository exams;
    private final ExamAssignmentRepository assignments;
    private final ExamAttemptRepository attempts;
    private final InvitationWorkflow invitations;

    public EmployeeAssignmentWorkflow(
            UserRepository users,
            ExamRepository exams,
            ExamAssignmentRepository assignments,
            ExamAttemptRepository attempts,
            InvitationWorkflow invitations) {

        this.users = users;
        this.exams = exams;
        this.assignments = assignments;
        this.attempts = attempts;
        this.invitations = invitations;
    }

    /**
     * Assign an exam to a student.
     */
    @Transactional
    public Map<String, Object> assign(String actorEmail, AssignExamRequest req) {

        if (req == null || req.examId() == null || req.userId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Exam ID and student ID are required"
            );
        }

        User actor = users.findByEmailIgnoreCase(actorEmail)
                .orElseThrow(() ->
                        new EntityNotFoundException("Assigning user not found"));

        User student = users.findById(req.userId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Student not found"));

        Exam exam = exams.findById(req.examId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Exam not found"));

        if (student.getRole() != Role.STUDENT) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Target user must have STUDENT role"
            );
        }

        if ("CANCELLED".equalsIgnoreCase(exam.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cancelled exams cannot be assigned"
            );
        }

        // Prevent duplicate assignments.
        boolean alreadyAssigned = assignments.existsByExamIdAndUserId(
                req.examId(),
                req.userId()
        );

        if (alreadyAssigned) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This student is already assigned to this exam"
            );
        }

        ExamAssignment assignment = new ExamAssignment();

        assignment.setExam(exam);
        assignment.setUser(student);
        assignment.setAssignedBy(actor);
        assignment.setAssignedAt(Instant.now());
        assignment.setDueAt(req.dueAt());
        assignment.setStatus("ASSIGNED");

        ExamAssignment saved = assignments.save(assignment);

        Map<String, Object> response =
                new LinkedHashMap<>(assignmentView(saved));

        // Create the invitation after saving the assignment.
        Map<String, Object> invitation = invitations.create(
                actorEmail,
                exam.getId(),
                student.getEmail()
        );

        response.put("invitationId", invitation.get("id"));
        response.put("invitationEmailSent", invitation.get("emailSent"));
        response.put("invitationMessage", invitation.get("message"));

        return response;
    }

    /**
     * List assignments created by the logged-in employee.
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> assignedByMe(String email) {

        User actor = users.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found"));

        return assignments
                .findByAssignedByIdOrderByAssignedAtDesc(actor.getId())
                .stream()
                .map(this::assignmentView)
                .toList();
    }

    /**
     * List attempts belonging to students assigned by this employee.
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> candidateAttempts(String email) {

        User actor = users.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found"));

        List<ExamAssignment> mine =
                assignments.findByAssignedByIdOrderByAssignedAtDesc(actor.getId());

        Set<String> allowed = mine.stream()
                .map(a -> a.getExam().getId() + ":" + a.getUser().getId())
                .collect(Collectors.toSet());

        return mine.stream()
                .flatMap(a -> attempts.findByExamId(a.getExam().getId()).stream())
                .filter(a -> allowed.contains(
                        a.getExam().getId() + ":" + a.getUser().getId()
                ))
                .distinct()
                .map(a -> {
                    Map<String, Object> result = new LinkedHashMap<>();

                    result.put("id", a.getId());
                    result.put("examId", a.getExam().getId());
                    result.put("examTitle", a.getExam().getTitle());
                    result.put("studentId", a.getUser().getId());
                    result.put("studentEmail", a.getUser().getEmail());
                    result.put("status", a.getStatus());
                    result.put(
                            "startedAt",
                            a.getStartedAt() == null
                                    ? ""
                                    : a.getStartedAt().toString()
                    );

                    return result;
                })
                .toList();
    }

    /**
     * Convert assignment entity into API response.
     */
    private Map<String, Object> assignmentView(ExamAssignment a) {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("id", a.getId());
        response.put("examId", a.getExam().getId());
        response.put("examTitle", a.getExam().getTitle());

        response.put("studentId", a.getUser().getId());
        response.put("studentFirstName", a.getUser().getFirstName());
        response.put(
                "studentLastName",
                a.getUser().getLastName() == null
                        ? ""
                        : a.getUser().getLastName()
        );
        response.put("studentEmail", a.getUser().getEmail());

        response.put(
                "assignedById",
                a.getAssignedBy() == null
                        ? null
                        : a.getAssignedBy().getId()
        );

        response.put(
                "assignedByEmail",
                a.getAssignedBy() == null
                        ? ""
                        : a.getAssignedBy().getEmail()
        );

        response.put(
                "assignedAt",
                a.getAssignedAt() == null
                        ? ""
                        : a.getAssignedAt().toString()
        );

        response.put(
                "dueAt",
                a.getDueAt() == null
                        ? ""
                        : a.getDueAt().toString()
        );

        response.put("status", a.getStatus());

        return response;
    }

    /**
     * List all students.
     */
    @Transactional(readOnly = true)
    public List<User> students() {
        return users.findByRole(Role.STUDENT);
    }
}