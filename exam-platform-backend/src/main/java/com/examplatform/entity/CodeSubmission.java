package com.examplatform.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "code_submissions")
public class CodeSubmission {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attempt_id", nullable = false)
    private ExamAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String sourceCode;

    @Column(nullable = false, length = 40)
    private String language;

    @Column(nullable = false, length = 30)
    private String status = "PENDING";

    private Double score;
    private Integer passedTestCases;
    private Integer totalTestCases;

    @Column(columnDefinition = "LONGTEXT")
    private String executionOutput;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    private Instant submittedAt = Instant.now();
}
