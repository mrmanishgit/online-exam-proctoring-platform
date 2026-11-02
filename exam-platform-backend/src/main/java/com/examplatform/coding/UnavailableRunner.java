package com.examplatform.coding;
import org.springframework.http.HttpStatus; import org.springframework.stereotype.Component; import org.springframework.web.server.ResponseStatusException;
/** Safe default: application starts, but code execution is disabled until a real remote sandbox adapter is configured. */
@Component
public class UnavailableRunner implements IsolatedCodeRunner {
 @Override public RunResult run(String language,String sourceCode,String stdin,long timeLimitMillis,long memoryLimitKb){throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,"Coding sandbox is not configured. Configure an isolated Judge0-compatible runner before enabling code execution.");}
}
