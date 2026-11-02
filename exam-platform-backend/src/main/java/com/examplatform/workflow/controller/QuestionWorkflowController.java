package com.examplatform.workflow.controller;

import com.examplatform.entity.Exam;
import com.examplatform.entity.Question;
import com.examplatform.entity.QuestionOption;
import com.examplatform.repository.ExamRepository;
import com.examplatform.repository.QuestionOptionRepository;
import com.examplatform.repository.QuestionRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams/{examId}/questions")
@PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
public class QuestionWorkflowController {
    private final ExamRepository exams;
    private final QuestionRepository questions;
    private final QuestionOptionRepository options;

    public QuestionWorkflowController(ExamRepository exams, QuestionRepository questions,
            QuestionOptionRepository options) {
        this.exams = exams;
        this.questions = questions;
        this.options = options;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<Map<String, Object>> list(@PathVariable Long examId) {
        if (!exams.existsById(examId)) throw new EntityNotFoundException("Exam not found");
        return questions.findByExamIdOrderByDisplayOrderAsc(examId).stream().map(q -> Map.<String, Object>of(
                "id", q.getId(), "questionText", q.getQuestionText(), "questionType", q.getQuestionType(),
                "marks", q.getMarks() == null ? 0.0 : q.getMarks(),
                "displayOrder", q.getDisplayOrder() == null ? 0 : q.getDisplayOrder(),
                "options", options.findByQuestionIdOrderByDisplayOrderAsc(q.getId()).stream().map(o -> Map.of(
                        "id", o.getId(), "optionText", o.getOptionText(), "displayOrder", o.getDisplayOrder() == null ? 0 : o.getDisplayOrder())).toList()
        )).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public Map<String, Object> create(@PathVariable Long examId, @Valid @RequestBody QuestionCreateRequest request) {
        Exam exam = exams.findById(examId).orElseThrow(() -> new EntityNotFoundException("Exam not found"));
        if ("PUBLISHED".equalsIgnoreCase(exam.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Questions cannot be changed after publishing");
        }
        if ("MCQ".equalsIgnoreCase(request.questionType())) {
            long optionCount = request.options() == null ? 0 : request.options().stream()
                    .filter(o -> o.optionText() != null && !o.optionText().isBlank()).count();
            long correctCount = request.options() == null ? 0 : request.options().stream()
                    .filter(o -> o.optionText() != null && !o.optionText().isBlank())
                    .filter(o -> Boolean.TRUE.equals(o.correct())).count();
            if (optionCount < 2 || correctCount != 1) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "An MCQ requires at least two options and exactly one correct option");
            }
        }
        Question q = new Question();
        q.setExam(exam); q.setQuestionText(request.questionText()); q.setQuestionType(request.questionType());
        q.setMarks(request.marks()); q.setNegativeMarks(request.negativeMarks()); q.setDisplayOrder(request.displayOrder());
        q.setExplanation(request.explanation()); q.setRequired(request.required() == null || request.required());
        q = questions.save(q);
        if (request.options() != null) {
            int order = 1;
            for (OptionRequest optionRequest : request.options()) {
                if (optionRequest.optionText() == null || optionRequest.optionText().isBlank()) continue;
                QuestionOption option = new QuestionOption(); option.setQuestion(q);
                option.setOptionText(optionRequest.optionText().trim());
                option.setCorrect(Boolean.TRUE.equals(optionRequest.correct()));
                option.setDisplayOrder(optionRequest.displayOrder() == null ? order : optionRequest.displayOrder());
                options.save(option); order++;
            }
        }
        return Map.of("id", q.getId(), "examId", examId, "questionText", q.getQuestionText(), "questionType", q.getQuestionType());
    }

    public record QuestionCreateRequest(@NotBlank String questionText, @NotBlank String questionType,
            @NotNull Double marks, Double negativeMarks, Integer displayOrder, String explanation,
            Boolean required, List<OptionRequest> options) {}
    public record OptionRequest(@NotBlank String optionText, Boolean correct, Integer displayOrder) {}
}
