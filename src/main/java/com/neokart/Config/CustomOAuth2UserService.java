package com.neokart.Config;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.neokart.Entity.User;
import com.neokart.Enum.Role;
import com.neokart.Repository.UserRepository;
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
	
	@Autowired
	 private  UserRepository userRepository;
	
	@Autowired
	    private  JwtUtils jwtUtil;

	    @Override
	    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
	        OAuth2User user = super.loadUser(userRequest);

	        String email = user.getAttribute("email");
	        String name = user.getAttribute("name");

	        User existingUser = userRepository.findByEmail(email).orElse(null);

	        if (existingUser == null) {
	            existingUser = User.builder()
	                    .email(email)
	                    .name(name)
	                    .password("") // not needed for Google login
	                    .role(Role.USER)
	                    .verified(true)
	                    .provider("GOOGLE")
	                    .build();

	            userRepository.save(existingUser);
	        }

	        return new DefaultOAuth2User(
	                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
	                user.getAttributes(),
	                "email"
	        );
	    }

}
