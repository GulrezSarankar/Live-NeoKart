package com.neokart.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neokart.Entity.AuditLog;
import com.neokart.Repository.AuditLogRepository;

@RestController
@RequestMapping("/api/admin/audit")
@PreAuthorize("hasRole('ADMIN')")

public class AuditLogController {
	
	 @Autowired
	    private AuditLogRepository auditLogRepository;

	    @GetMapping
	    public ResponseEntity<List<AuditLog>> getAllLogs() {
	        return ResponseEntity.ok(auditLogRepository.findAll());
	    }

}
