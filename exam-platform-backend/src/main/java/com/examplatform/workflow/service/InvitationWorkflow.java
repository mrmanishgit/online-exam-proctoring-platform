package com.examplatform.workflow.service;

import com.examplatform.entity.*;
import com.examplatform.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class InvitationWorkflow {
    private final ExamInvitationRepository invitations;
    private final ExamRepository exams;
    private final UserRepository users;
    private final ExamAssignmentRepository assignments;
    private final JavaMailSender mail;
    private final SecureRandom random = new SecureRandom();

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public InvitationWorkflow(ExamInvitationRepository invitations, ExamRepository exams,
            UserRepository users, ExamAssignmentRepository assignments, JavaMailSender mail) {
        this.invitations = invitations;
        this.exams = exams;
        this.users = users;
        this.assignments = assignments;
        this.mail = mail;
    }

    @Transactional
    public Map<String, Object> create(String actorEmail, Long examId, String email) {
        User actor = users.findByEmailIgnoreCase(actorEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Exam exam = exams.findById(examId)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found"));
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        if (normalizedEmail.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Candidate email is required");
        }

        ExamInvitation existing = invitations.findByExamId(examId).stream()
                .filter(i -> i.getEmail().equalsIgnoreCase(normalizedEmail))
                .filter(i -> "PENDING".equalsIgnoreCase(i.getStatus()))
                .findFirst().orElse(null);
        if (existing != null) {
            boolean resent = sendEmail(existing);
            return Map.of("id", existing.getId(), "examId", exam.getId(), "examTitle", exam.getTitle(),
                    "email", existing.getEmail(), "status", existing.getStatus(), "emailSent", resent,
                    "message", resent ? "Existing invitation email resent" : "Existing invitation remains saved, but email delivery failed");
        }
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        ExamInvitation invitation = new ExamInvitation();
        invitation.setExam(exam);
        invitation.setEmail(normalizedEmail);
        invitation.setInvitedBy(actor);
        invitation.setInvitationToken(Base64.getUrlEncoder().withoutPadding().encodeToString(bytes));
        invitation.setStatus("PENDING");
        invitation.setCreatedAt(Instant.now());
        invitation.setExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS));
        invitation = invitations.save(invitation);

        boolean sent = sendEmail(invitation);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", invitation.getId());
        response.put("examId", exam.getId());
        response.put("examTitle", exam.getTitle());
        response.put("email", invitation.getEmail());
        response.put("status", invitation.getStatus());
        response.put("createdAt", invitation.getCreatedAt());
        response.put("expiresAt", invitation.getExpiresAt());
        response.put("emailSent", sent);
        response.put("message", sent ? "Invitation email sent" : "Invitation saved, but email delivery failed. Check SMTP configuration and retry.");
        return response;
    }

    private boolean sendEmail(ExamInvitation invitation) {
        try {
            String link = frontendUrl.replaceAll("/+$", "") + "/invitation/accept?token=" + invitation.getInvitationToken();
            MimeMessage message = mail.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setTo(invitation.getEmail());
            helper.setSubject("Invitation: " + invitation.getExam().getTitle());
            helper.setText("You are invited to attend " + invitation.getExam().getTitle()
                    + ". Sign in or register using this email, then accept your invitation: " + link, false);
            mail.send(message);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> list() {
        return invitations.findAll().stream().map(i -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", i.getId()); row.put("examId", i.getExam().getId());
            row.put("examTitle", i.getExam().getTitle()); row.put("email", i.getEmail());
            row.put("status", i.getStatus()); row.put("createdAt", i.getCreatedAt());
            row.put("expiresAt", i.getExpiresAt());
            row.put("invitedByEmail", i.getInvitedBy() == null ? "" : i.getInvitedBy().getEmail());
            return row;
        }).toList();
    }

    @Transactional
    public Map<String, Object> resend(Long id) {
        ExamInvitation invitation = invitations.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invitation not found"));
        if ("ACCEPTED".equalsIgnoreCase(invitation.getStatus()) || "REVOKED".equalsIgnoreCase(invitation.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This invitation cannot be resent");
        }
        boolean sent = sendEmail(invitation);
        return Map.of("id", invitation.getId(), "emailSent", sent,
                "message", sent ? "Invitation email resent" : "Email delivery failed; check SMTP configuration");
    }

    @Transactional
    public Object accept(String token, String authenticatedEmail) {
        ExamInvitation invitation = invitations.findByInvitationToken(token)
                .orElseThrow(() -> new EntityNotFoundException("Invitation not found"));
        if (!"PENDING".equalsIgnoreCase(invitation.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Invitation is not pending");
        }
        if (invitation.getExpiresAt() == null || invitation.getExpiresAt().isBefore(Instant.now())) {
            invitation.setStatus("EXPIRED");
            invitations.save(invitation);
            throw new ResponseStatusException(HttpStatus.GONE, "Invitation expired");
        }
        if (!invitation.getEmail().equalsIgnoreCase(authenticatedEmail)) {
            throw new org.springframework.security.access.AccessDeniedException("Invitation belongs to another email");
        }
        User student = users.findByEmailIgnoreCase(authenticatedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT,
                        "Register with the invited email address before accepting this invitation"));
        if (assignments.existsByExamIdAndUserId(invitation.getExam().getId(), student.getId())) {
            invitation.setStatus("ACCEPTED");
            invitation.setAcceptedAt(Instant.now());
            invitations.save(invitation);
            return Map.of("accepted", true, "alreadyAssigned", true, "examId", invitation.getExam().getId());
        }
        ExamAssignment assignment = new ExamAssignment();
        assignment.setExam(invitation.getExam());
        assignment.setUser(student);
        assignment.setAssignedBy(invitation.getInvitedBy());
        assignment.setAssignedAt(Instant.now());
        assignment.setStatus("ASSIGNED");
        assignments.save(assignment);

        invitation.setStatus("ACCEPTED");
        invitation.setAcceptedAt(Instant.now());
        invitations.save(invitation);
        return Map.of("accepted", true, "examId", invitation.getExam().getId(), "assignmentId", assignment.getId());
    }

    @Transactional
    public void revoke(Long id) {
        ExamInvitation invitation = invitations.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invitation not found"));
        if ("ACCEPTED".equalsIgnoreCase(invitation.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Accepted invitation cannot be revoked");
        }
        invitation.setStatus("REVOKED");
        invitations.save(invitation);
    }
}
