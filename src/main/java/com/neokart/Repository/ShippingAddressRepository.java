package com.neokart.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neokart.Entity.ShippingAddress;

public interface ShippingAddressRepository extends JpaRepository<ShippingAddress, Long> {

}
