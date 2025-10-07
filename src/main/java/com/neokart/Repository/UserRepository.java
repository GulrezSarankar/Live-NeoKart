package com.neokart.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.neokart.DTO.UserGrowthDto;
import com.neokart.Entity.User;

public interface UserRepository extends JpaRepository<User, Long>{
	
    Optional<User> findByEmail(String email);
    
    Optional<User> findByPhone(String phone);

    
    @Query(value = "SELECT CAST(created_at AS DATE) AS date, COUNT(*) AS count " +
            "FROM users GROUP BY CAST(created_at AS DATE) ORDER BY date", nativeQuery = true)
    List<Object[]> findUserGrowthByDateNative();
    
//    Search By Email
    List<User> findByEmailContainingIgnoreCase(String email);
    
//    Forgot Password
    Optional<User> findByResetToken(String resetToken);


    
 









}
