package com.neokart.Config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.neokart.Entity.User;
import com.neokart.Repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {
	
	@Autowired
	UserRepository repository;
	
	@Autowired
	JwtUtils jwtUtils;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, 
			HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		// TODO Auto-generated method stub
		
		 OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
	        String email = oauthUser.getAttribute("email");

	        User user = repository.findByEmail(email).orElseThrow();

	        String token = jwtUtils.generateToken(user);

	        // ✅ Return token in response (can also redirect with token param)
	        response.setContentType("application/json");
	        response.getWriter().write("{\"token\": \"" + token + "\"}");
	    
		
	}

}
