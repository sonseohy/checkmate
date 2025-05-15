package com.checkmate.domain.contractfieldvalue.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "legalClauses")
@Getter
@Setter
public class LegalClause {
    @Id
    private String id;

    private String titleText;
    private String groupId;
    private Integer displayOrder;
    private List<Integer> targetFields;
    private List<Integer> categoryIds;
    private CompositeCondition groupCondition;
    private List<Component> components;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    public static class Component {
        private String type;
        private String text;
        private Integer order;
        private List<Integer> categoryIds;

        private CompositeCondition conditions;
    }

    @Getter
    @Setter
    public static class CompositeCondition {
        private Integer fieldId;
        private String operator;
        private Object value;

        // 복합 조건 (OR, AND)
        private List<CompositeCondition> or;
        private List<CompositeCondition> and;
    }

    public Integer getCategoryId() {
        return categoryIds != null && !categoryIds.isEmpty() ? categoryIds.get(0) : null;
    }

    public void setCategoryId(Integer categoryId) {
        if (this.categoryIds == null) {
            this.categoryIds = new ArrayList<>();
        }
        if (!this.categoryIds.contains(categoryId)) {
            this.categoryIds.add(categoryId);
        }
    }
}