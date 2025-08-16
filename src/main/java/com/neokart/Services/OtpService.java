package com.neokart.Services;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.neokart.Repository.UserRepository;
import com.neokart.Util.OtpGenerator;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OtpService {

	
	@Autowired
    private  UserRepository userRepository;
	@Autowired
	OtpGenerator generator;

	private final Map<String, OtpEntry> otpStorage = new HashMap<>();

    private final long OTP_VALIDITY_SECONDS = 300; // 5 minutes

    public String sendOtp(String phone) {
        String otp = generateOtp();
        otpStorage.put(phone, new OtpEntry(otp, Instant.now()));
        generator.sendOtp(phone, otp);
        return "OTP sent successfully";
    }


    public boolean verifyOtp(String phone, String otp) {
        OtpEntry entry = otpStorage.get(phone);
        if (entry == null) return false;
        boolean isExpired = Instant.now().isAfter(entry.timestamp.plusSeconds(OTP_VALIDITY_SECONDS));
        return entry.otp.equals(otp) && !isExpired;
    }

    private String generateOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000); // 6-digit OTP
    }

    private static class OtpEntry {
        String otp;
        Instant timestamp;

        OtpEntry(String otp, Instant timestamp) {
            this.otp = otp;
            this.timestamp = timestamp;
        }
    }
    
    public void clearOtp(String phone) {
        otpStorage.remove(phone);
    }

}
