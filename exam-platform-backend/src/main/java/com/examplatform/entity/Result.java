
package com.examplatform.entity;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "results", uniqueConstraints = {
		@UniqueConstraint(name = "uk_result_exam_attempt", columnNames = "exam_attempt_id") })
public class Result {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "exam_attempt_id", nullable = false, unique = true)
	private ExamAttempt examAttempt;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal obtainedMarks;

	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal totalMarks;

	@Column(nullable = false, precision = 5, scale = 2)
	private BigDecimal percentage;

	@Column(length = 10)
	private String grade;

	@Column(nullable = false, length = 20)
	private String status;

	@Column(nullable = false)
	private Boolean published = false;

	private Instant publishedAt;

	@Column(length = 1000)
	private String remarks;

	@Column(nullable = false, updatable = false)
	private Instant createdAt;

	private Instant updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = Instant.now();
		updatedAt = createdAt;

		if (published == null) {
			published = false;
		}
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = Instant.now();
	}
}
