package com.neokart.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PageResponse<T> {
	

	 private List<T> content;
	    private int pageNumber;
	    private int pageSize;
	    private long totalElements;
	    private int totalPages;
	    private boolean last;
	}



