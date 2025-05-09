package com.checkmate.domain.contractfieldvalue.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "legal_clauses")
@Getter
@Setter
public class LegalClause {
    @Id
    private String id;
    private String clauseType;
    private String clauseId;
    private String titleText;
    private Integer displayOrder;
    private List<Component> components;
    private List<String> applicableContractTypes;
    private Boolean isRequired;
    private Map<String, Object> displayConditions;
    private String version;
    private LocalDateTime lastUpdated;

    @Getter
    @Setter
    public static class Component {
        private String type;
        private String text;
        private Integer order;
        private Map<String, String> fieldMappings;
    }
}