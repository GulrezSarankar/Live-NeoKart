package com.neokart.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neokart.Entity.ContactMessage;
import com.neokart.Services.ContactMessageService;


@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = {
	    "http://localhost:3000",
	    "https://live-neo-kart.vercel.app"
	})
public class ContactMessageController {
	
	
    @Autowired
    private ContactMessageService contactMessageService;

    // User sends message
    @PostMapping
    public ContactMessage sendMessage(@RequestBody ContactMessage message) {
        return contactMessageService.saveMessage(message);
    }

    // Admin fetches all messages
    @GetMapping
    public List<ContactMessage> getMessages() {
        return contactMessageService.getAllMessages();
    }

}
