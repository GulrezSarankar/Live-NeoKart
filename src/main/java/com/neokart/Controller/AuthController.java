package com.neokart.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neokart.DTO.ForgotPasswordRequest;
import com.neokart.DTO.LoginRequest;
import com.neokart.DTO.RegisterRequest;
import com.neokart.DTO.ResetPasswordRequest;
import com.neokart.DTO.VerifyOtpRequest;
import com.neokart.Services.AuthService;
import com.neokart.Services.EmailService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {
	    "http://localhost:3000",
	    "https://live-neo-kart.vercel.app"
	})public class AuthController {
	
	@Autowired
    private  AuthService authService;

	
	 @Autowired
	    private EmailService emailService; 

	 @PostMapping("/register")
	 public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
	     try {
	         String message = authService.register(request);
	         // Return JSON with success, message, email, and phone
	         return ResponseEntity.ok(Map.of(
	             "success", true,
	             "message", message,
	             "email", request.getEmail(),
	             "phone", request.getPhone()
	         ));
	     } catch (RuntimeException ex) {
	         return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                 .body(Map.of("success", false, "message", ex.getMessage()));
	     } catch (Exception ex) {
	         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                 .body(Map.of("success", false, "message", "Registration failed: " + ex.getMessage()));
	     }
	 }


	
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/send-otp/{phone}")
    public ResponseEntity<?> sendOtp(@PathVariable String phone) {
        try {
            String message = authService.sendOtp(phone);
            return ResponseEntity.ok(Map.of("success", true, "message", message));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(Map.of("success", false, "message", ex.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        try {
            String message = authService.verifyOtp(request);
            return ResponseEntity.ok(Map.of("success", true, "message", message));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(Map.of("success", false, "message", ex.getMessage()));
        }
    }


    @PostMapping("/resend-otp/{phone}")
    public ResponseEntity<?> resendOtp(@PathVariable String phone) {
        try {
            String message = authService.sendOtp(phone); // reuses sendOtp logic
            return ResponseEntity.ok(message);
        } catch (UsernameNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Resend OTP failed: " + ex.getMessage());
        }
    }

    
//    Admin Login And Details 
    
    
    @PostMapping("/admin/register")
    public ResponseEntity<?> registerAdmin(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.registerAdmin(request));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.loginAdmin(request));
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok("Password reset link sent to email (check console for now).");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Password reset successfully!");
    }

}
