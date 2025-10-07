package com.neokart.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neokart.Entity.User;
import com.neokart.Entity.WishList;

public interface WishListRepository  extends JpaRepository<WishList, Long>{
	
    Optional<WishList> findByUser(User user);


}
