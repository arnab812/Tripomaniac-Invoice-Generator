
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { BillData, formatCurrency, formatDate } from "@/lib/utils";

export const generatePDF = (billData: BillData) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Tripomaniac_Invoice_${billData.customerId}`,
    subject: 'Travel Invoice',
    author: 'Tripomaniac Travel Agency',
    creator: 'Tripomaniac Billing Software'
  });

  // Add logo
  // Note: In a real app, you would load the logo from a file or URL
  // For this demo, we'll create a simple text representation
  doc.setFontSize(24);
  doc.setTextColor(14, 165, 233); // travel-500 color
  doc.setFont("helvetica", "bold");
  doc.text("TRIPOMANIAC", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text("Premium Travel Experiences", doc.internal.pageSize.getWidth() / 2, 26, { align: "center" });

  // Add horizontal line
  doc.setDrawColor(220, 220, 220);
  doc.line(15, 30, doc.internal.pageSize.getWidth() - 15, 30);

  // Add invoice title
  doc.setFontSize(16);
  doc.setTextColor(50, 50, 50);
  doc.setFont("helvetica", "bold");
  doc.text("TRAVEL INVOICE", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });

  // Customer information section
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("CUSTOMER DETAILS", 15, 50);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  // Left column
  doc.text(`Name: ${billData.firstName} ${billData.lastName}`, 15, 58);
  doc.text(`Contact: ${billData.contactNumber}`, 15, 64);
  doc.text(`Email: ${billData.email}`, 15, 70);
  
  // Right column
  doc.text(`Customer ID: ${billData.customerId}`, doc.internal.pageSize.getWidth() - 85, 58);
  doc.text(`Booking Date: ${formatDate(billData.bookingDate)}`, doc.internal.pageSize.getWidth() - 85, 64);
  doc.text(`Check-in Date: ${formatDate(billData.checkInDate)}`, doc.internal.pageSize.getWidth() - 85, 70);

  // Hotel information
  doc.setFont("helvetica", "bold");
  doc.text("ACCOMMODATION DETAILS", 15, 80);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Hotel: ${billData.hotelName}`, 15, 88);
  doc.text(`Room: ${billData.roomNumber}`, 15, 94);
  doc.text(`Travel Security: ${billData.travelSecurity ? "Yes" : "No"}`, 15, 100);

  // Services Table
  doc.setFont("helvetica", "bold");
  doc.text("SERVICES", 15, 110);

  // Create the services table
  const tableData = billData.services.map(service => [
    service.name,
    service.details,
    formatCurrency(service.amount)
  ]);

  autoTable(doc, {
    startY: 115,
    head: [['Service', 'Details', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [14, 165, 233],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 80 },
      2: { cellWidth: 40, halign: 'right' }
    }
  });

  // Get the last Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Payment Information
  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT SUMMARY", doc.internal.pageSize.getWidth() - 75, finalY);
  
  doc.setFont("helvetica", "normal");
  doc.text("Service Charge:", doc.internal.pageSize.getWidth() - 75, finalY + 8);
  doc.text(formatCurrency(billData.serviceCharge), doc.internal.pageSize.getWidth() - 15, finalY + 8, { align: "right" });
  
  doc.text("Advanced Amount:", doc.internal.pageSize.getWidth() - 75, finalY + 14);
  doc.text(formatCurrency(billData.advancedAmount), doc.internal.pageSize.getWidth() - 15, finalY + 14, { align: "right" });
  
  doc.text("Due Amount:", doc.internal.pageSize.getWidth() - 75, finalY + 20);
  doc.text(formatCurrency(billData.dueAmount), doc.internal.pageSize.getWidth() - 15, finalY + 20, { align: "right" });
  
  // Draw a line for total
  doc.setDrawColor(14, 165, 233); // travel-500 color
  doc.setLineWidth(0.5);
  doc.line(doc.internal.pageSize.getWidth() - 75, finalY + 24, doc.internal.pageSize.getWidth() - 15, finalY + 24);
  
  // Total cost
  doc.setFont("helvetica", "bold");
  doc.setTextColor(14, 165, 233); // travel-500 color
  doc.text("TOTAL COST:", doc.internal.pageSize.getWidth() - 75, finalY + 30);
  doc.text(formatCurrency(billData.totalCost), doc.internal.pageSize.getWidth() - 15, finalY + 30, { align: "right" });
  
  // Add footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for choosing Tripomaniac for your travel needs.", doc.internal.pageSize.getWidth() / 2, footerY, { align: "center" });
  doc.text("This is a computer generated invoice and does not require signature.", doc.internal.pageSize.getWidth() / 2, footerY + 5, { align: "center" });

  // Save the PDF
  doc.save(`Tripomaniac_Invoice_${billData.customerId}.pdf`);
};
