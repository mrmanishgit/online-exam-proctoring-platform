package com.examplatform.dto.coding;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TestCaseResponse {
    private Long id;
    private String input;
    private String expectedOutput;
    private Boolean hidden;
    private Integer displayOrder;
}
