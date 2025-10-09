package com.neokart.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neokart.Entity.AdminSettings;

public interface AdminSettingRepository extends JpaRepository<AdminSettings,Long> {

}
