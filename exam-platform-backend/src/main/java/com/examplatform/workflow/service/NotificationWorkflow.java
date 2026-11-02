package com.examplatform.workflow.service;

import com.examplatform.entity.Notification;
import com.examplatform.entity.User;
import com.examplatform.repository.NotificationRepository;
import com.examplatform.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;

@Service
public class NotificationWorkflow {
    private final NotificationRepository notifications; private final UserRepository users;
    public NotificationWorkflow(NotificationRepository notifications, UserRepository users){this.notifications=notifications;this.users=users;}
    private User current(String email){return users.findByEmailIgnoreCase(email).orElseThrow(()->new EntityNotFoundException("User not found"));}
    public List<Notification> mine(String email){return notifications.findByUserIdOrderByCreatedAtDesc(current(email).getId());}
    public long unread(String email){return notifications.countByUserIdAndReadFalse(current(email).getId());}
    @Transactional public void markRead(String email,Long id){User u=current(email); Notification n=notifications.findByIdAndUserId(id,u.getId()).orElseThrow(()->new EntityNotFoundException("Notification not found")); n.setRead(true); n.setReadAt(Instant.now()); notifications.save(n);}
    @Transactional public void markAllRead(String email){User u=current(email); notifications.findByUserIdAndReadFalseOrderByCreatedAtDesc(u.getId()).forEach(n->{n.setRead(true);n.setReadAt(Instant.now());});}
    @Transactional public void delete(String email,Long id){User u=current(email); Notification n=notifications.findByIdAndUserId(id,u.getId()).orElseThrow(()->new EntityNotFoundException("Notification not found")); notifications.delete(n);}
}
