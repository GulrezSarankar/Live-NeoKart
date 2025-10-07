package com.neokart.Services;

import java.io.FileOutputStream;

import org.springframework.stereotype.Service;

import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.neokart.Entity.Order;
@Service
public class PdfService {

	
	  public String generateInvoice(Order order) {
	        try {
	            String filePath = "invoices/Invoice_" + order.getId() + ".pdf";

	            Document document = new Document();
	            PdfWriter.getInstance(document, new FileOutputStream(filePath));
	            document.open();

	            document.add(new Paragraph("Invoice for Order #" + order.getId()));
	            document.add(new Paragraph("Customer: " + order.getUser().getName()));
	            document.add(new Paragraph("Email: " + order.getUser().getEmail()));
	            document.add(new Paragraph("Total Price: $" + order.getTotalPrice()));

	            document.close();

	            return filePath;
	        } catch (Exception e) {
	            throw new RuntimeException("Error generating invoice PDF", e);
	        }
	    }
}
