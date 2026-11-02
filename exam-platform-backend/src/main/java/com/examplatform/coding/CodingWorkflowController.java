package com.examplatform.coding;
import com.examplatform.entity.*; import com.examplatform.repository.*; import jakarta.validation.Valid; import org.springframework.http.HttpStatus; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/coding") @PreAuthorize("hasRole('STUDENT')")
public class CodingWorkflowController {
 private final IsolatedCodeRunner runner; private final QuestionRepository questions; private final CodingTestCaseRepository cases; private final UserRepository users; private final ExamAttemptRepository attempts; private final CodeSubmissionRepository submissions;
 public CodingWorkflowController(IsolatedCodeRunner r,QuestionRepository q,CodingTestCaseRepository c,UserRepository u,ExamAttemptRepository a,CodeSubmissionRepository s){runner=r;questions=q;cases=c;users=u;attempts=a;submissions=s;}
 @PostMapping("/run") public Object run(@Valid @RequestBody CodeRunRequest req,Authentication auth){
  Question q=questions.findById(req.questionId()).orElseThrow(); User user=users.findByEmailIgnoreCase(auth.getName()).orElseThrow();
  ExamAttempt attempt=attempts.findFirstByExamIdAndUserIdOrderByStartedAtDesc(q.getExam().getId(),user.getId()).orElseThrow();
  if(!"IN_PROGRESS".equalsIgnoreCase(attempt.getStatus()))throw new IllegalStateException("Attempt is not active");
  var tests=cases.findByQuestionIdAndHiddenFalse(q.getId()); if(tests.isEmpty())throw new IllegalStateException("No public test cases configured");
  List<Object> results=new ArrayList<>();
  for(CodingTestCase tc:tests){var result=runner.run(req.language(),req.sourceCode(),tc.getInputData(),2000,256000); results.add(Map.of("status",result.status(),"stdout",Objects.toString(result.stdout(),""),"stderr",Objects.toString(result.stderr(),""),"passed",Objects.equals(normalize(result.stdout()),normalize(tc.getExpectedOutput()))));}
  return Map.of("questionId",q.getId(),"testResults",results);
 }
 private String normalize(String s){return s==null?"":s.trim().replace("\r\n","\n");}
}
