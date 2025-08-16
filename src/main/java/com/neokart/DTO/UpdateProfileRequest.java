package com.neokart.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateProfileRequest {

	
    private String name;
    private String phone;
    private String currentPassword;
    private String newPassword;

}
