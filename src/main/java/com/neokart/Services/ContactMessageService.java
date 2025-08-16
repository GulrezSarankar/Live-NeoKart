package com.neokart.Services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neokart.Entity.ContactMessage;
import com.neokart.Repository.ContactMessageRepository;

@Service
public class ContactMessageService {
	
    @Autowired
    private ContactMessageRepository contactMessageRepository;

    // Save new message
    public ContactMessage saveMessage(ContactMessage message) {
        message.setCreatedAt(LocalDateTime.now());
        return contactMessageRepository.save(message);
    }

    // Fetch all messages (for Admin)
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }

}
