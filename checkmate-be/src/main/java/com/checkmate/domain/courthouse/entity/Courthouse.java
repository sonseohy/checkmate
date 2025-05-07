package com.checkmate.domain.courthouse.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Courthouse {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false)
	private int courthouseId;

	@Column(nullable = false, length = 30)
	private String courthouseName;

	@Column(nullable = false)
	private String courthouseAddress;

	@Column(nullable = false, length = 20)
	private String courthousePhoneNumber;

}
