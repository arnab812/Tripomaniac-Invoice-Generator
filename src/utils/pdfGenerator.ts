
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { BillData, formatCurrency, formatDate } from "@/lib/utils";
import { AnyARecord } from "dns";
// import logo from '@/assets/logo.png';

export const generatePDF = (billData: BillData) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Tripomaniac_Invoice_${billData.firstName}_${billData.lastName}`,
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

  // Create the services table with better adjusted column widths
  const tableData = billData.services.map(service => [
    service.name,
    service.details,
    formatCurrency(service.amount)
  ]);

  // Calculate available page width
  const pageWidth = doc.internal.pageSize.getWidth();
  const tableWidth = pageWidth - 30; // 15px margin on each side

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
      fontSize: 9,
      cellPadding: 3,
      overflow: 'linebreak' // Handle overflow with line breaks
    },
    columnStyles: {
      0: { cellWidth: tableWidth * 0.30 }, // 30% of table width for Service
      1: { cellWidth: tableWidth * 0.50 }, // 50% of table width for Details
      2: { cellWidth: tableWidth * 0.20, halign: 'left' } // 20% of table width for Amount
    },
    margin: { left: 15, right: 15 }
  });

  // Get the last Y position after the table
  // const finalY = (doc as any).lastAutoTable.finalY + 10;
  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Create an improved styled box for payment summary with more spacing
  const paymentSummaryX = doc.internal.pageSize.getWidth() - 90;
  const paymentSummaryWidth = 75;
  
  // Background for payment summary
  doc.setFillColor(248, 250, 252);  // Light gray background
  doc.roundedRect(
    paymentSummaryX, 
    finalY, 
    paymentSummaryWidth, 
    55, 
    2, 
    2, 
    'F'
  );
  
  // Border for payment summary
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(
    paymentSummaryX, 
    finalY, 
    paymentSummaryWidth, 
    55, 
    2, 
    2, 
    'S'
  );

  // Payment Information Title
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text("PAYMENT SUMMARY", paymentSummaryX + paymentSummaryWidth/2, finalY + 8, { align: "center" });
  
  // Payment items - increased vertical spacing between items
  doc.setFont("helvetica", "normal");
  doc.setTextColor(70, 70, 70);

  const textOffsetX = 10; // Adjust this value to shift the text to the left

  doc.text("Service Charge:", paymentSummaryX + textOffsetX, finalY + 18);
  doc.text(formatCurrency(billData.serviceCharge), paymentSummaryX + paymentSummaryWidth - textOffsetX, finalY + 18, { align: "right" });

  doc.text("Advanced Amount:", paymentSummaryX + textOffsetX, finalY + 28);
  doc.text(formatCurrency(billData.advancedAmount), paymentSummaryX + paymentSummaryWidth - textOffsetX, finalY + 28, { align: "right" });

  doc.text("Due Amount:", paymentSummaryX + textOffsetX, finalY + 38);
  doc.text(formatCurrency(billData.dueAmount), paymentSummaryX + paymentSummaryWidth - textOffsetX, finalY + 38, { align: "right" });

  // Draw a line for total
  doc.setDrawColor(14, 165, 233); // travel-500 color
  doc.setLineWidth(0.5);
  doc.line(paymentSummaryX + textOffsetX, finalY + 42, paymentSummaryX + paymentSummaryWidth - textOffsetX, finalY + 42);

  // Total cost
  doc.setFont("helvetica", "bold");
  doc.setTextColor(14, 165, 233); // travel-500 color
  doc.text("TOTAL COST:", paymentSummaryX + textOffsetX, finalY + 50);
  doc.text(formatCurrency(billData.totalCost), paymentSummaryX + paymentSummaryWidth - textOffsetX, finalY + 50, { align: "right" });
  
  // Add footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for choosing Tripomaniac for your travel needs.", doc.internal.pageSize.getWidth() / 2, footerY, { align: "center" });
  // doc.text("This is a computer generated invoice and does not require signature.", doc.internal.pageSize.getWidth() / 2, footerY + 5, { align: "center" });

  // Save the PDF
  doc.save(`Tripomaniac_Invoice_for_${billData.firstName}_${billData.lastName}_${new Date().toISOString()}.pdf`);
};
