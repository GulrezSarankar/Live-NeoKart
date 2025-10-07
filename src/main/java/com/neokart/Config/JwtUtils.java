package com.neokart.Config;

import java.security.Key;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.neokart.Entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
	
		  @Value("${jwt.secret}")  private String jwtSecret; 
	  @Value("${jwt.expirationMs}")  private int jwtExpirationMs;
	  
	    

	    private Key getSigningKey() {
	        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
	    }

	    public String generateJwtToken(String username, List<String> roles) {
	        return Jwts.builder()
	                .setSubject(username)
	                .claim("roles", roles)
	                .setIssuedAt(new Date())
	                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
	                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
	                .compact();
	    }

	    public String getUsernameFromJwtToken(String token) {
	        return Jwts.parserBuilder()
	                .setSigningKey(getSigningKey())
	                .build()
	                .parseClaimsJws(token)
	                .getBody()
	                .getSubject();
	    }

	    public List<String> getRolesFromJwtToken(String token) {
	        Claims claims = Jwts.parserBuilder()
	                .setSigningKey(getSigningKey())
	                .build()
	                .parseClaimsJws(token)
	                .getBody();
	        return claims.get("roles", List.class);
	    }

	    public boolean validateJwtToken(String authToken) {
	        try {
	            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
	            return true;
	        } catch (JwtException | IllegalArgumentException e) {
	        }
	        return false;
	    }

	    public String generateToken(User user) {
	        List<String> roles = List.of(user.getRole().name()); 

	        return generateJwtToken(user.getEmail(), roles);
	    }


}
