package com.examplatform.workflow.service;

import com.examplatform.entity.*;
import com.examplatform.repository.*;
import com.examplatform.workflow.dto.*;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ExamWorkflowService {

    private final UserRepository users;
    private final ExamRepository exams;
    private final ExamAttemptRepository attempts;
    private final QuestionRepository questions;
    private final QuestionOptionRepository options;
    private final AnswerRepository answers;
    private final ResultRepository results;
    private final ExamAssignmentRepository assignments;

    public ExamWorkflowService(
            UserRepository users,
            ExamRepository exams,
            ExamAttemptRepository attempts,
            QuestionRepository questions,
            QuestionOptionRepository options,
            AnswerRepository answers,
            ResultRepository results,
            ExamAssignmentRepository assignments) {

        this.users = users;
        this.exams = exams;
        this.attempts = attempts;
        this.questions = questions;
        this.options = options;
        this.answers = answers;
        this.results = results;
        this.assignments = assignments;
    }

    private User user(String email) {
        return users.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found"));
    }

    /**
     * Start an exam for the logged-in student.
     */
    @Transactional
    public AttemptView start(String email, Long examId) {

        User student = user(email);

        Exam exam = exams.findById(examId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Exam not found"));

        Instant now = Instant.now();

        // Only published exams can be started.
        if (!"PUBLISHED".equalsIgnoreCase(exam.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Exam is not published"
            );
        }

        // Check scheduled start time.
        if (exam.getStartTime() != null &&
                now.isBefore(exam.getStartTime())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Exam has not started yet"
            );
        }

        // Check scheduled end time.
        if (exam.getEndTime() != null &&
                now.isAfter(exam.getEndTime())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Exam has ended"
            );
        }

        // Verify that the student has an active assignment.
        ExamAssignment assignment =
                assignments.findFirstByExamIdAndUserId(
                        examId,
                        student.getId()
                ).orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.FORBIDDEN,
                                "This exam has not been assigned to you"
                        )
                );

        if (!"ASSIGNED".equalsIgnoreCase(assignment.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This exam assignment is no longer active"
            );
        }

        // Resume an existing attempt instead of creating another.
        Optional<ExamAttempt> existing =
                attempts.findFirstByExamIdAndUserIdOrderByStartedAtDesc(
                        examId,
                        student.getId()
                );

        if (existing.isPresent()) {

            ExamAttempt previous = existing.get();

            if ("IN_PROGRESS".equalsIgnoreCase(previous.getStatus())) {

                if (isAttemptExpired(previous, now)) {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Your exam time has expired"
                    );
                }

                return view(previous);
            }

            if ("SUBMITTED".equalsIgnoreCase(previous.getStatus()) ||
                    "COMPLETED".equalsIgnoreCase(previous.getStatus())) {

                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "You have already submitted this exam"
                );
            }
        }

        ExamAttempt attempt = new ExamAttempt();

        attempt.setExam(exam);
        attempt.setUser(student);
        attempt.setStartedAt(now);
        attempt.setStatus("IN_PROGRESS");
        attempt.setTotalMarks(exam.getTotalMarks());

        ExamAttempt saved = attempts.save(attempt);

        return view(saved);
    }

    /**
     * Get questions for an attempt owned by the logged-in student.
     */
    @Transactional(readOnly = true)
    public List<QuestionView> questions(String email, Long attemptId) {

        ExamAttempt attempt = ownedAttempt(email, attemptId);

        ensureInProgress(attempt);

        enforceTime(attempt);

        return questions
                .findByExamIdOrderByDisplayOrderAsc(
                        attempt.getExam().getId()
                )
                .stream()
                .map(question -> {

                    List<QuestionView.OptionView> optionViews =
                            options.findByQuestionIdOrderByDisplayOrderAsc(
                                    question.getId()
                            )
                            .stream()
                            .map(option ->
                                    new QuestionView.OptionView(
                                            option.getId(),
                                            option.getOptionText(),
                                            option.getDisplayOrder()
                                    )
                            )
                            .toList();

                    return new QuestionView(
                            question.getId(),
                            question.getQuestionText(),
                            question.getQuestionType(),
                            question.getMarks(),
                            question.getDisplayOrder(),
                            optionViews
                    );
                })
                .toList();
    }

    /**
     * Save or update an answer.
     */
    @Transactional
    public void saveAnswer(
            String email,
            Long attemptId,
            SaveAnswerRequest request) {

        if (request == null || request.questionId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Question ID is required"
            );
        }

        ExamAttempt attempt = ownedAttempt(email, attemptId);

        ensureInProgress(attempt);

        enforceTime(attempt);

        Question question = questions.findById(request.questionId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Question not found"));

        if (!Objects.equals(
                question.getExam().getId(),
                attempt.getExam().getId())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Question does not belong to this exam"
            );
        }

        QuestionOption selectedOption = null;

        if (request.selectedOptionId() != null) {

            selectedOption = options.findById(request.selectedOptionId())
                    .orElseThrow(() ->
                            new EntityNotFoundException("Option not found"));

            if (!Objects.equals(
                    selectedOption.getQuestion().getId(),
                    question.getId())) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Option does not belong to this question"
                );
            }
        }

        Answer answer = answers
                .findByAttemptIdAndQuestionId(
                        attemptId,
                        question.getId()
                )
                .orElseGet(Answer::new);

        answer.setAttempt(attempt);
        answer.setQuestion(question);
        answer.setSelectedOption(selectedOption);
        answer.setAnswerText(request.answerText());
        answer.setSavedAt(Instant.now());

        answers.save(answer);
    }

    /**
     * Submit an attempt and calculate objective-question marks.
     */
    @Transactional
    public AttemptView submit(String email, Long attemptId) {

        ExamAttempt attempt = ownedAttempt(email, attemptId);

        ensureInProgress(attempt);

        List<Answer> submitted = answers.findByAttemptId(attemptId);

        double obtainedMarks = 0.0;

        for (Answer answer : submitted) {

            Question question = answer.getQuestion();

            // This implementation evaluates selected-option answers.
            if (answer.getSelectedOption() != null) {

                boolean correct = Boolean.TRUE.equals(
                        answer.getSelectedOption().getCorrect()
                );

                answer.setCorrect(correct);

                double questionMarks =
                        Optional.ofNullable(question.getMarks())
                                .orElse(0.0);

                double negativeMarks =
                        Optional.ofNullable(question.getNegativeMarks())
                                .orElse(
                                        Optional.ofNullable(
                                                attempt.getExam()
                                                        .getNegativeMarkValue()
                                        ).orElse(0.0)
                                );

                double awardedMarks;

                if (correct) {
                    awardedMarks = questionMarks;
                } else if (Boolean.TRUE.equals(
                        attempt.getExam().getNegativeMarking())) {

                    awardedMarks = -negativeMarks;
                } else {
                    awardedMarks = 0.0;
                }

                answer.setAwardedMarks(awardedMarks);

                obtainedMarks += awardedMarks;
            }
        }

        answers.saveAll(submitted);

        double totalMarks = Optional.ofNullable(
                attempt.getExam().getTotalMarks()
        ).orElseGet(() ->
                questions.findByExamIdOrderByDisplayOrderAsc(
                        attempt.getExam().getId()
                ).stream()
                .mapToDouble(q ->
                        Optional.ofNullable(q.getMarks()).orElse(0.0)
                )
                .sum()
        );

        Instant submittedAt = Instant.now();

        attempt.setObtainedMarks(obtainedMarks);
        attempt.setTotalMarks(totalMarks);
        attempt.setSubmittedAt(submittedAt);
        attempt.setEvaluatedAt(submittedAt);
        attempt.setStatus("SUBMITTED");

        double passingMarks = Optional.ofNullable(
                attempt.getExam().getPassingMarks()
        ).orElse(0.0);

        attempt.setPassed(obtainedMarks >= passingMarks);

        ExamAttempt savedAttempt = attempts.save(attempt);

        // Mark the assignment as completed.
        assignments.findFirstByExamIdAndUserId(
                attempt.getExam().getId(),
                attempt.getUser().getId()
        ).ifPresent(assignment -> {
            assignment.setStatus("COMPLETED");
            assignments.save(assignment);
        });

        // Create a result only if one does not already exist.
        if (results.findByExamAttemptId(attemptId).isEmpty()) {

            BigDecimal obtained = BigDecimal.valueOf(obtainedMarks)
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal total = BigDecimal.valueOf(totalMarks)
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal percentage = totalMarks <= 0
                    ? BigDecimal.ZERO
                    : obtained.multiply(BigDecimal.valueOf(100))
                            .divide(
                                    total,
                                    2,
                                    RoundingMode.HALF_UP
                            );

            Result result = new Result();

            result.setExamAttempt(savedAttempt);
            result.setObtainedMarks(obtained);
            result.setTotalMarks(total);
            result.setPercentage(percentage);
            result.setStatus("EVALUATED");
            result.setPublished(false);

            results.save(result);
        }

        return view(savedAttempt);
    }

    /**
     * Find an attempt belonging to the authenticated student.
     */
    @Transactional(readOnly = true)
    public ExamAttempt ownedAttempt(String email, Long attemptId) {

        User student = user(email);

        return attempts.findByIdAndUserId(
                attemptId,
                student.getId()
        ).orElseThrow(() ->
                new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Attempt not found"
                )
        );
    }

    private void ensureInProgress(ExamAttempt attempt) {

        if (!"IN_PROGRESS".equalsIgnoreCase(attempt.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Attempt is not in progress"
            );
        }
    }

    /**
     * Calculate the effective deadline:
     * the earlier of the individual attempt deadline and exam end time.
     */
    private Instant effectiveDeadline(ExamAttempt attempt) {

        if (attempt.getStartedAt() == null ||
                attempt.getExam().getDurationMinutes() == null) {
            return attempt.getExam().getEndTime();
        }

        Instant attemptDeadline = attempt.getStartedAt()
                .plusSeconds(
                        attempt.getExam().getDurationMinutes() * 60L
                );

        Instant scheduledEnd = attempt.getExam().getEndTime();

        if (scheduledEnd == null) {
            return attemptDeadline;
        }

        return attemptDeadline.isBefore(scheduledEnd)
                ? attemptDeadline
                : scheduledEnd;
    }

    private boolean isAttemptExpired(
            ExamAttempt attempt,
            Instant now) {

        Instant deadline = effectiveDeadline(attempt);

        return deadline != null && now.isAfter(deadline);
    }

    private void enforceTime(ExamAttempt attempt) {

        if (isAttemptExpired(attempt, Instant.now())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Exam time has expired"
            );
        }
    }

    private AttemptView view(ExamAttempt attempt) {

        return new AttemptView(
                attempt.getId(),
                attempt.getExam().getId(),
                attempt.getStatus(),
                attempt.getStartedAt(),
                attempt.getSubmittedAt(),
                attempt.getObtainedMarks(),
                attempt.getTotalMarks()
        );
    }
}