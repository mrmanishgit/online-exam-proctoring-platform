package com.examplatform.workflow.controller;

import com.examplatform.workflow.dto.AssignExamRequest;
import com.examplatform.workflow.service.EmployeeAssignmentWorkflow;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class EmployeeWorkflowController {
    private final EmployeeAssignmentWorkflow workflow;

    public EmployeeWorkflowController(EmployeeAssignmentWorkflow workflow) {
        this.workflow = workflow;
    }

    @PostMapping("/exam-assignments")
    @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Object assign(@Valid @RequestBody AssignExamRequest req, Authentication auth) {
        return workflow.assign(auth.getName(), req);
    }

    @GetMapping("/employee/exams")
    @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
    public Object myAssignments(Authentication auth) {
        return workflow.assignedByMe(auth.getName());
    }

    @GetMapping("/employee/attempts")
    @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
    public Object attempts(Authentication auth) {
        return workflow.candidateAttempts(auth.getName());
    }

    @GetMapping("/workflow/students")
    @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
    public Object students() {
        return workflow.students().stream().map(u -> java.util.Map.of(
                "id", u.getId(),
                "firstName", u.getFirstName(),
                "lastName", u.getLastName() == null ? "" : u.getLastName(),
                "email", u.getEmail(),
                "role", u.getRole().name())).toList();
    }
}
