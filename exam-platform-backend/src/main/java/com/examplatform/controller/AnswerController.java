package com.examplatform.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examplatform.entity.Answer;
import com.examplatform.service.AnswerService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/answers")
public class AnswerController {

	private final AnswerService service;

	public AnswerController(AnswerService service) {
		this.service = service;
	}

	@PostMapping
	public ResponseEntity<Answer> create(@Valid @RequestBody Answer entity) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
	}

	@GetMapping
	public ResponseEntity<List<Answer>> getAll() {
		return ResponseEntity.ok(service.getAll());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Answer> getById(@PathVariable Long id) {
		return service.getById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PutMapping("/{id}")
	public ResponseEntity<Answer> update(@PathVariable Long id, @Valid @RequestBody Answer entity) {
		if (!service.existsById(id))
			return ResponseEntity.notFound().build();
		return ResponseEntity.ok(service.update(id, entity));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id) {
		if (!service.existsById(id))
			return ResponseEntity.notFound().build();
		service.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
