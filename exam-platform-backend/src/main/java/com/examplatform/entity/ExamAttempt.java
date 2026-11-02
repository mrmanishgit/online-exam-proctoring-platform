package com.examplatform.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "exam_attempts", indexes = {
    @Index(name = "idx_attempt_user_exam", columnList = "user_id, exam_id")
})
public class ExamAttempt {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Instant startedAt;
    private Instant submittedAt;
    private Instant evaluatedAt;

    @Column(nullable = false, length = 30)
    private String status = "IN_PROGRESS";

    private Double obtainedMarks;
    private Double totalMarks;
    private Boolean passed;

    private String ipAddress;
    private String browserInfo;
}
