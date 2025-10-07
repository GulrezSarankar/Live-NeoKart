package com.neokart.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AdminProfileDto {
	
	
    private Long id;
    private String name;
    private String email;
    private String phone;

}
