package com.examplatform.workflow.controller;

import com.examplatform.workflow.service.InvitationWorkflow;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invitations")
public class InvitationWorkflowController {
    private final InvitationWorkflow workflow;

    public InvitationWorkflowController(InvitationWorkflow workflow) {
        this.workflow = workflow;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    public Object list() {
        return workflow.list();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    @ResponseStatus(HttpStatus.CREATED)
    public Object create(@RequestBody InvitationRequest request, Authentication auth) {
        return workflow.create(auth.getName(), request.examId(), request.email());
    }

    @PostMapping("/{id}/resend")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    public Object resend(@PathVariable Long id) {
        return workflow.resend(id);
    }

    @PostMapping("/{token}/accept")
    @PreAuthorize("hasRole('STUDENT')")
    public Object accept(@PathVariable String token, Authentication auth) {
        return workflow.accept(token, auth.getName());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revoke(@PathVariable Long id) {
        workflow.revoke(id);
    }

    public record InvitationRequest(Long examId, String email) {}
}
