package com.checkmate.domain.contractcategory.entity;

import com.checkmate.domain.checklist.entity.CheckList;
import com.checkmate.domain.template.entity.Template;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "contract_category")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ContractCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", length = 30)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "level", length = 63)
    private Level level;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private ContractCategory parent;

    @OneToMany(mappedBy = "parent",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<ContractCategory> children = new ArrayList<>();

    @OneToMany(mappedBy = "category",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    private List<CheckList> checkLists = new ArrayList<>();

    @OneToMany(mappedBy = "category",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    private List<Template> templates = new ArrayList<>();

    public void addChild(ContractCategory child) {
        children.add(child);
        child.setParent(this);
    }

    public void addCheckList(CheckList cl) {
        checkLists.add(cl);
        cl.setCategory(this);
    }
    public void removeCheckList(CheckList cl) {
        checkLists.remove(cl);
        cl.setCategory(null);
    }

    public void addTemplate(Template t) {
        templates.add(t);
        t.setCategory(this);
    }
    public void removeTemplate(Template t) {
        templates.remove(t);
        t.setCategory(null);
    }

}
