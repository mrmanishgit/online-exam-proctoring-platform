package com.examplatform.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "proctor_media")
public class ProctorMedia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attempt_id", nullable = false)
    private ExamAttempt attempt;

    @Column(nullable = false, length = 1000)
    private String storagePath;

    @Column(nullable = false, length = 30)
    private String mediaType;

    private Instant capturedAt = Instant.now();
    private Long fileSizeBytes;

    @Column(length = 100)
    private String contentType;
}
