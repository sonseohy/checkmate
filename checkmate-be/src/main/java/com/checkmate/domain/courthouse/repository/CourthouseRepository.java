package com.checkmate.domain.courthouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.checkmate.domain.courthouse.entity.Courthouse;

public interface CourthouseRepository extends JpaRepository<Courthouse, Integer> {
}
