package com.examplatform.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "exam_assignments", uniqueConstraints = {
    @UniqueConstraint(name = "uk_assignment_exam_user", columnNames = {"exam_id", "user_id"})
})
public class ExamAssignment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by")
    private User assignedBy;

    private Instant assignedAt = Instant.now();
    private Instant dueAt;

    @Column(nullable = false, length = 30)
    private String status = "ASSIGNED";
}
