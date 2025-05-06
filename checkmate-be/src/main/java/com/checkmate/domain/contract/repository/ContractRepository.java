package com.checkmate.domain.contract.repository;

import com.checkmate.domain.contract.entity.Contract;
import com.checkmate.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContractRepository extends JpaRepository<Contract, Integer> {
    List<Contract> findAllByUser(User user);
}
