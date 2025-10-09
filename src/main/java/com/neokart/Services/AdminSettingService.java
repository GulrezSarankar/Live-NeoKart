package com.neokart.Services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neokart.Entity.AdminSettings;
import com.neokart.Repository.AdminSettingRepository;

@Service
public class AdminSettingService {
	
	
	   @Autowired
	    private AdminSettingRepository repo;

	    public AdminSettings getSettings() {
	        return repo.findAll().stream().findFirst().orElse(new AdminSettings());
	    }

	    public AdminSettings updateSettings(AdminSettings newSettings) {
	        Optional<AdminSettings> existing = repo.findAll().stream().findFirst();
	        if (existing.isPresent()) {
	            newSettings.setId(existing.get().getId());
	        }
	        return repo.save(newSettings);
	    }

}
