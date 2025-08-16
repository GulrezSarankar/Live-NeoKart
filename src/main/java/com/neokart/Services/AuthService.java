package com.neokart.Services;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.neokart.Config.JwtUtils;
import com.neokart.DTO.LoginRequest;
import com.neokart.DTO.RegisterRequest;
import com.neokart.DTO.VerifyOtpRequest;
import com.neokart.Entity.User;
import com.neokart.Enum.Role;
import com.neokart.Repository.UserRepository;

@Service
public class AuthService {
	
	@Autowired
    private  UserRepository userRepository;
	@Autowired
    private  PasswordEncoder passwordEncoder;
	@Autowired
    private  JwtUtils jwtUtils;
	@Autowired
    private  OtpService otpService;
	@Autowired
	EmailService emailService;

	 // ⏺ Step 1: Register User (save with verified=false & send OTP)
	public String register(RegisterRequest request) {
	    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
	        throw new RuntimeException("User already registered with this email");
	    }

	    if (userRepository.findByPhone(request.getPhone()).isPresent()) {
	        throw new RuntimeException("User already registered with this phone number");
	    }

	    User user = User.builder()
	            .name(request.getName())
	            .email(request.getEmail())
	            .password(passwordEncoder.encode(request.getPassword()))
	            .phone(request.getPhone())
	            .role(Role.USER)
	            .verified(false)
	            .provider("LOCAL")
	            .createdAt(LocalDateTime.now())
	            .build();

	    userRepository.save(user);

	    otpService.sendOtp(user.getPhone());

	    emailService.sendWelcomeEmail(user.getEmail(), user.getName());

	    return "User registered successfully. OTP sent to " + user.getPhone() + 
	           " and welcome email sent to " + user.getEmail();
	}

	public Map<String, Object> login(LoginRequest request) {
	    Map<String, Object> response = new HashMap<>();
	    try {
	        User user = userRepository.findByEmail(request.getEmail())
	                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

	        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
	            response.put("success", false);
	            response.put("message", "Invalid email or password");
	            return response;
	        }

	        if (!user.isVerified()) {
	            response.put("success", false);
	            response.put("message", "OTP verification pending for this account.");
	            return response;
	        }

	        String token = jwtUtils.generateToken(user);
	        response.put("success", true);
	        response.put("token", token);
	        response.put("name", user.getName());
	        response.put("role", user.getRole());
	        return response;

	    } catch (UsernameNotFoundException e) {
	        response.put("success", false);
	        response.put("message", "Invalid email or password");
	        return response;
	    } catch (Exception e) {
	        response.put("success", false);
	        response.put("message", "Something went wrong. Please try again later.");
	        return response;
	    }
	}
    // 🔁 Step 3: Resend OTP
    public String sendOtp(String phone) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with phone: " + phone));

        if (user.isVerified()) {
            return "User already verified. No need to resend OTP.";
        }

        return otpService.sendOtp(phone);
    }

    // ✅ Step 4: Verify OTP
    public String verifyOtp(VerifyOtpRequest request) {
        boolean isValid = otpService.verifyOtp(request.getPhone(), request.getOtp());

        if (!isValid) {
            throw new RuntimeException("Invalid or expired OTP. Please try again.");
        }

        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with phone: " + request.getPhone()));

        if (user.isVerified()) {
            return "User is already verified.";
        }

        user.setVerified(true);
        userRepository.save(user);

        otpService.clearOtp(request.getPhone()); // remove OTP from storage

        return "OTP verified successfully. You can now log in.";
    }

    
    
 // 🚫 No OTP for Admin
    public String registerAdmin(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Admin already exists with this email");
        }

        User admin = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.ADMIN)
                .verified(true) // ✅ Auto-verified
                .provider("LOCAL")
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(admin);
        return "Admin registered successfully";
    }

    // 🔐 Login for Admin
    public String loginAdmin(LoginRequest request) {
        User admin = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied! Not an admin account.");
        }

        return jwtUtils.generateToken(admin);
    }

    

}
