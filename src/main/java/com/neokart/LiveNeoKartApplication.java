package com.neokart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class LiveNeoKartApplication {

	 public static void main(String[] args) {
	        // Load .env file
	        Dotenv dotenv = Dotenv.load();

	        // Set environment variables so Spring Boot can read them
	        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
	        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
	        System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
	        System.setProperty("TWILIO_ACCOUNT_SID", dotenv.get("TWILIO_ACCOUNT_SID"));
	        System.setProperty("TWILIO_AUTH_TOKEN", dotenv.get("TWILIO_AUTH_TOKEN"));
	        System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
	        System.setProperty("GOOGLE_CLIENT_SECRET", dotenv.get("GOOGLE_CLIENT_SECRET"));
	        System.setProperty("EMAIL_USERNAME", dotenv.get("EMAIL_USERNAME"));
	        System.setProperty("EMAIL_PASSWORD", dotenv.get("EMAIL_PASSWORD"));
	        System.setProperty("PAYPAL_CLIENT_ID", dotenv.get("PAYPAL_CLIENT_ID"));
	        System.setProperty("PAYPAL_CLIENT_SECRET", dotenv.get("PAYPAL_CLIENT_SECRET"));
	        System.setProperty("TWILIO_ACCOUNT_SID", dotenv.get("TWILIO_ACCOUNT_SID"));
	        System.setProperty("TWILIO_AUTH_TOKEN", dotenv.get("TWILIO_AUTH_TOKEN"));
	        System.setProperty("TWILIO_PHONE_NUMBER", dotenv.get("TWILIO_PHONE_NUMBER"));


	        SpringApplication.run(LiveNeoKartApplication.class, args);
	    }
}
