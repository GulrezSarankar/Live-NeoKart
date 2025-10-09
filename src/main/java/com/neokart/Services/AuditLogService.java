package com.neokart.Services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neokart.Entity.AuditLog;
import com.neokart.Repository.AuditLogRepository;

@Service
public class AuditLogService {

	
	@Autowired
	private AuditLogRepository repository;
	
	public void readaction(String email, String action) {
		AuditLog log=AuditLog.builder()
				.action(action)
				.performedBy(email)
				.timestamp(LocalDateTime.now())
				.build();
		repository.save(log);
	}
}
