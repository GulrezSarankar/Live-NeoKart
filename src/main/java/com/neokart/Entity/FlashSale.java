package com.neokart.Entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "flash-sale")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class FlashSale {
	
	
	
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    private boolean status;

    @OneToMany(mappedBy="flashSale", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<FlashSaleProduct> products = new ArrayList<>();

}
