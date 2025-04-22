package com.checkmate.domain.ocrresult.repository;

import com.checkmate.domain.ocrresult.entity.OcrResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OcrResultRepository extends JpaRepository<OcrResult, Integer> {
}
