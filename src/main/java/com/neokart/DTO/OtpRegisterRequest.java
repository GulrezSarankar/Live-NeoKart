package com.neokart.DTO;

import lombok.Data;

@Data
public class OtpRegisterRequest {
	
    private String name;
    private String email;
    private String phone;
    private String password;

}
