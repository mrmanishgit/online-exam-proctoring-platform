package com.examplatform.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "exams")
public class Exam {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 200)
	private String title;

	@Column(length = 2000)
	private String description;

	@Column(length = 100)
	private String subject;

	@Column(nullable = false, length = 40)
	private String examType;

	@Column(nullable = false)
	private Integer durationMinutes;

	private Double totalMarks;

	private Double passingMarks;

	@Column(nullable = false, length = 30)
	private String status = "DRAFT";

	private Instant startTime;

	private Instant endTime;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "created_by")
	private User createdBy;

	private Boolean shuffleQuestions = false;

	private Boolean negativeMarking = false;

	private Double negativeMarkValue;

	@Column(nullable = false, updatable = false)
	private Instant createdAt;

	private Instant updatedAt;

	@PrePersist
	protected void onCreate() {
		Instant now = Instant.now();

		if (createdAt == null) {
			createdAt = now;
		}

		updatedAt = now;

		if (status == null || status.isBlank()) {
			status = "DRAFT";
		}

		if (shuffleQuestions == null) {
			shuffleQuestions = false;
		}

		if (negativeMarking == null) {
			negativeMarking = false;
		}
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = Instant.now();
	}
}