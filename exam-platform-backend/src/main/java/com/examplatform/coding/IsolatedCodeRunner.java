package com.examplatform.coding;
import java.util.Map;
/** Adapter boundary for Judge0 or another isolated remote execution service. */
public interface IsolatedCodeRunner {
    RunResult run(String language, String sourceCode, String stdin, long timeLimitMillis, long memoryLimitKb);
    record RunResult(String stdout, String stderr, String status, Integer exitCode) {}
}
