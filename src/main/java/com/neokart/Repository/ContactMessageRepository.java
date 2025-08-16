package com.neokart.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neokart.Entity.ContactMessage;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

}
