package com.examplatform.workflow.controller;
import com.examplatform.workflow.service.NotificationWorkflow;
import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import org.springframework.http.HttpStatus; import org.springframework.security.access.prepost.PreAuthorize;
@RestController @RequestMapping("/api/notifications") @PreAuthorize("isAuthenticated()")
public class NotificationWorkflowController {
 private final NotificationWorkflow workflow; public NotificationWorkflowController(NotificationWorkflow workflow){this.workflow=workflow;}
 @GetMapping public Object mine(Authentication a){return workflow.mine(a.getName());}
 @GetMapping("/unread-count") public Object unread(Authentication a){return java.util.Map.of("unreadCount",workflow.unread(a.getName()));}
 @PatchMapping("/{id}/read") @ResponseStatus(HttpStatus.NO_CONTENT) public void read(@PathVariable Long id,Authentication a){workflow.markRead(a.getName(),id);}
 @PatchMapping("/read-all") @ResponseStatus(HttpStatus.NO_CONTENT) public void readAll(Authentication a){workflow.markAllRead(a.getName());}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id,Authentication a){workflow.delete(a.getName(),id);}
}
