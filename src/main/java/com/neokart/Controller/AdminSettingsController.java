package com.neokart.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neokart.Entity.AdminSettings;
import com.neokart.Services.AdminSettingService;

@RestController
@RequestMapping("/api/admin/settings")
public class AdminSettingsController {
	
    @Autowired
    
    private AdminSettingService service;

    @GetMapping
    public AdminSettings getSettings() {
        return service.getSettings();
    }

    @PutMapping
    public AdminSettings updateSettings(@RequestBody AdminSettings settings) {
        return service.updateSettings(settings);
    }

}
