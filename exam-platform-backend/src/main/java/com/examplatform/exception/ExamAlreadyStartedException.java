package com.examplatform.exception;

public class ExamAlreadyStartedException extends RuntimeException {
    public ExamAlreadyStartedException(String message) { super(message); }
}
