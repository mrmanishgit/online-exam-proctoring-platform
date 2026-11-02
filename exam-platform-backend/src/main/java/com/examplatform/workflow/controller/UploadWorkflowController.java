package com.examplatform.workflow.controller;
import com.examplatform.storage.PrivateFileStorageService; import org.springframework.http.HttpStatus; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*; import org.springframework.web.multipart.MultipartFile;
@RestController @RequestMapping("/api/uploads") @PreAuthorize("isAuthenticated()") public class UploadWorkflowController {
 private final PrivateFileStorageService storage; public UploadWorkflowController(PrivateFileStorageService s){storage=s;}
 @PostMapping(consumes="multipart/form-data") @ResponseStatus(HttpStatus.CREATED) public Object upload(@RequestPart("file") MultipartFile file){return storage.store(file);}
 @PostMapping(value="/images",consumes="multipart/form-data") @ResponseStatus(HttpStatus.CREATED) public Object image(@RequestPart("file") MultipartFile file){return storage.store(file);}
}
