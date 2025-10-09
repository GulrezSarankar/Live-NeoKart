package com.neokart.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.neokart.Entity.AuditLog;
@Repository
public interface AuditLogRepository  extends JpaRepository<AuditLog, Long>{

}
