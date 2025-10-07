	package com.neokart.Services;
	
import java.math.BigDecimal;
	
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.neokart.Entity.Order;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
	
@Service
	
public class EmailService {
	
	
	@Autowired
	private PdfService invoiceService;
		
	
	@Autowired
	   
	private JavaMailSender mailSender;
	
	    // ✅ Send Welcome Email
	    public void sendWelcomeEmail(String toEmail, String userName) {
	        try {
	            MimeMessage message = mailSender.createMimeMessage();
	            MimeMessageHelper helper = new MimeMessageHelper(message, true);
	
	            helper.setTo(toEmail);
	            helper.setSubject("Welcome to NeoKart – Let's Start Shopping!");
	
	            String content = """
	                <html>
	                  <body style="font-family: Arial, sans-serif; text-align: center;">
	                    <img src="cid:neokartLogo" alt="NeoKart Logo" style="max-height:80px; margin-bottom:20px;">
	                    <h2 style="color: #FF5722;">Welcome to NeoKart, %s!</h2>
	                    <p style="font-size: 16px; color: #555;">
	                        Your shopping journey starts here. Explore the best products at the best prices.
	                    </p>
	                    <a href="https://neokart.com" style="display: inline-block; background-color: #FF5722; 
	                       color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
	                        Start Shopping
	                    </a>
	                    <p style="margin-top: 30px; font-size: 12px; color: #999;">
	                        &copy; 2025 NeoKart. All rights reserved.
	                    </p>
	                  </body>
	                </html>
	                """.formatted(userName);
	
	            helper.setText(content, true);
	            helper.addInline("neokartLogo", new ClassPathResource("static/images/NeoKart-logo.png"));
	
	            mailSender.send(message);
	            System.out.println("✅ Welcome email sent to: " + toEmail);
	
	        } catch (MessagingException e) {
	            System.err.println("❌ Failed to send welcome email: " + e.getMessage());
	        }
	    }
	
	    // ✅ Send Order Placed Email
	    public void sendOrderPlacedEmail(String toEmail, String userName, Long orderId, BigDecimal totalPrice) {
	        try {
	            MimeMessage message = mailSender.createMimeMessage();
	            MimeMessageHelper helper = new MimeMessageHelper(message, true);

	            helper.setTo(toEmail);
	            helper.setSubject("🛒 Your NeoKart Order #" + orderId + " has been placed!");

	            String content = """
	                <html>
	                  <body style="font-family: Arial, sans-serif;">
	                    <img src="cid:neokartLogo" alt="NeoKart Logo" style="max-height:80px; margin-bottom:20px;">
	                    <h2 style="color: #FF5722;">Hi %s,</h2>
	                    <p>Thank you for your order at NeoKart!</p>
	                    <p>Your order ID is <strong>%d</strong>.</p>
	                    <p>Order Total: <strong>$%.2f</strong></p>
	                  </body>
	                </html>
	                """.formatted(userName, orderId, totalPrice);

	            helper.setText(content, true);
	            helper.addInline("neokartLogo", new ClassPathResource("static/images/NeoKart-logo.png"));

	            mailSender.send(message);
	            System.out.println("✅ Order placed email sent to: " + toEmail);

	        } catch (MessagingException e) {
	            System.err.println("❌ Failed to send order placed email: " + e.getMessage());
	        }
	    }



	
	    // ✅ Send Order Status Update Email
	    public void sendOrderStatusUpdateEmail(String toEmail, String userName, Long orderId, String newStatus) {
	        try {
	            MimeMessage message = mailSender.createMimeMessage();
	            MimeMessageHelper helper = new MimeMessageHelper(message, true);
	
	            helper.setTo(toEmail);
	            helper.setSubject("Update on your NeoKart Order #" + orderId);
	
	            String content = """
	                <html>
	                  <body style="font-family: Arial, sans-serif;">
	                    <img src="cid:neokartLogo" alt="NeoKart Logo" style="max-height:80px; margin-bottom:20px;">
	                    <h2 style="color: #FF5722;">Hello %s,</h2>
	                    <p>Your order with ID <strong>%d</strong> status has been updated.</p>
	                    <p>New Status: <strong>%s</strong></p>
	                    <p>Thank you for shopping with NeoKart!</p>
	                    <a href="https://neokart.com/orders/%d" style="display: inline-block; background-color: #FF5722; 
	                       color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
	                       View Order Details
	                    </a>
	                    <p style="margin-top: 30px; font-size: 12px; color: #999;">&copy; 2025 NeoKart. All rights reserved.</p>
	                  </body>
	                </html>
	                """.formatted(userName, orderId, newStatus, orderId);
	
	            helper.setText(content, true);
	            helper.addInline("neokartLogo", new ClassPathResource("static/images/NeoKart-logo.png"));
	
	            mailSender.send(message);
	            System.out.println("✅ Order status update email sent to: " + toEmail);
	
	        } catch (MessagingException e) {
	            System.err.println("❌ Failed to send order status update email: " + e.getMessage());
	        }
	    }
	   
	    
	}
