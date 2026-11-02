package com.examplatform.workflow.controller;

import com.examplatform.workflow.dto.*;
import com.examplatform.workflow.service.ExamWorkflowService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/attempts")
@PreAuthorize("hasRole('STUDENT')")
public class ExamWorkflowController {
	private final ExamWorkflowService workflow;

	public ExamWorkflowController(ExamWorkflowService workflow) {
		this.workflow = workflow;
	}

	@PostMapping("/start/{examId}")
	@ResponseStatus(HttpStatus.CREATED)
	public AttemptView start(@PathVariable Long examId, Authentication auth) {
		return workflow.start(auth.getName(), examId);
	}

	@GetMapping("/{attemptId}/questions")
	public List<QuestionView> questions(@PathVariable Long attemptId, Authentication auth) {
		return workflow.questions(auth.getName(), attemptId);
	}

	@PutMapping("/{attemptId}/answers")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void save(@PathVariable Long attemptId, @Valid @RequestBody SaveAnswerRequest body, Authentication auth) {
		workflow.saveAnswer(auth.getName(), attemptId, body);
	}

	@PostMapping("/{attemptId}/submit")
	public AttemptView submit(@PathVariable Long attemptId, Authentication auth) {
		return workflow.submit(auth.getName(), attemptId);
	}
}
