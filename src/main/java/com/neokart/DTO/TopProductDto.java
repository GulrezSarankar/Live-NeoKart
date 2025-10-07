package com.neokart.DTO;

//@AllArgsConstructor
//@NoArgsConstructor
//@Data
public class TopProductDto {
	
    private String productName;
    private Long totalQuantity;
	public String getProductName() {
		return productName;
	}
	public void setProductName(String productName) {
		this.productName = productName;
	}
	public Long getTotalQuantity() {
		return totalQuantity;
	}
	public void setTotalQuantity(Long totalQuantity) {
		this.totalQuantity = totalQuantity;
	}
	public TopProductDto(String productName, Long totalQuantity) {
		super();
		this.productName = productName;
		this.totalQuantity = totalQuantity;
	}

    
    

}
