package com.neokart.DTO;

import java.sql.Date;  // change from java.time.LocalDate

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SaleByDateDto {
	
	
    private Date date;  // changed to java.sql.Date
    private Double totalSales;

}
