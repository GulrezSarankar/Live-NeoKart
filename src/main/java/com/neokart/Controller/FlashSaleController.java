package com.neokart.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;

import com.neokart.Entity.FlashSale;
import com.neokart.Services.FlashSaleService;

@RestController
@RequestMapping("/api/admin/flash-sales")
@CrossOrigin(origins = {
	    "http://localhost:3000",
	    "https://live-neo-kart.vercel.app"
	})
public class FlashSaleController {
	
    @Autowired
    private FlashSaleService flashSaleService;

    /** Get all flash sales */
    @GetMapping
    public List<FlashSale> getAllFlashSales() {
        return flashSaleService.getAllFlashsale();
    }

    /** Create flash sale safely */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FlashSale> createFlashSale(@RequestBody FlashSale flashSale) {
        FlashSale savedFlashSale = flashSaleService.createFlashsale(flashSale);
        return ResponseEntity.ok(savedFlashSale);
    }

    /** Delete flash sale by ID */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFlashSale(@PathVariable Long id) {
        flashSaleService.deleteFlashSale(id);
        return ResponseEntity.ok().build();
    }

    /** Get only active flash sales (for Home page offers) */
    @GetMapping("/active")
    public ResponseEntity<List<FlashSale>> getActiveFlashSales() {
        List<FlashSale> activeSales = flashSaleService.getAllFlashsale().stream()
                .filter(f -> f.isStatus() &&
                             f.getStartDatetime().isBefore(java.time.LocalDateTime.now()) &&
                             f.getEndDatetime().isAfter(java.time.LocalDateTime.now()))
                .toList();
        return ResponseEntity.ok(activeSales);
    }
}
