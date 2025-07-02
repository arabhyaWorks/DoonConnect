import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface TicketData {
  ticketId: string;
  routeName: string;
  routeColor: string;
  fromStop: string;
  toStop: string;
  seats: string[];
  passengerName: string;
  passengerPhone: string;
  date: string;
  time: string;
  totalAmount: number;
  qrCodeData: string;
}

export const generateTicketPDF = async (ticketData: TicketData) => {
  // Create new PDF document with ticket dimensions (80mm x 240mm for better spacing)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 240]
  });

  // Set white background
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, 80, 240, 'F');

  // Add main border
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(1);
  pdf.rect(2, 2, 76, 236);

  // Add inner decorative border
  pdf.setLineWidth(0.5);
  pdf.rect(4, 4, 72, 232);

  let yPos = 15;

  // Header section with logo and title
  try {
    // Load and add logo
    const logoResponse = await fetch('/image.png');
    const logoBlob = await logoResponse.blob();
    const logoDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(logoBlob);
    });
    
    // Add logo (centered, 20mm width)
    pdf.addImage(logoDataUrl, 'PNG', 30, yPos, 20, 20);
    yPos += 25;
  } catch (error) {
    console.warn('Could not load logo:', error);
    // Fallback: Add text logo
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('DOONCONNECT', 40, yPos, { align: 'center' });
    yPos += 8;
  }

  // Title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('BUS TICKET', 40, yPos, { align: 'center' });
  yPos += 8;

  // Ticket ID
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Ticket ID: ${ticketData.ticketId}`, 40, yPos, { align: 'center' });
  yPos += 12;

  // Separator line
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(1);
  pdf.line(8, yPos, 72, yPos);
  yPos += 15;

  // QR CODE SECTION (FIRST)
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(ticketData.qrCodeData, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // QR Code title
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('SCAN QR CODE', 40, yPos, { align: 'center' });
    yPos += 8;
    
    // Add QR code border
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(1);
    pdf.rect(20, yPos, 40, 40);
    
    // Add QR code image
    pdf.addImage(qrCodeDataUrl, 'PNG', 22, yPos + 2, 36, 36);
    yPos += 45;
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Show this QR code to conductor', 40, yPos, { align: 'center' });
    yPos += 15;
  } catch (error) {
    console.warn('Could not generate QR code:', error);
    // Fallback: Add placeholder
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(1);
    pdf.rect(20, yPos, 40, 40);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('QR CODE', 40, yPos + 20, { align: 'center' });
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Show to conductor', 40, yPos + 28, { align: 'center' });
    yPos += 50;
  }

  // Separator line
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(1);
  pdf.line(8, yPos, 72, yPos);
  yPos += 12;

  // ROUTE SECTION
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('ROUTE', 10, yPos);
  yPos += 6;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const routeText = truncateText(ticketData.routeName, 30);
  pdf.text(routeText, 10, yPos);
  yPos += 12;

  // FROM TO SECTION
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FROM', 10, yPos);
  pdf.text('TO', 45, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  // Truncate long stop names
  const fromStopText = truncateText(ticketData.fromStop, 15);
  const toStopText = truncateText(ticketData.toStop, 15);
  
  pdf.text(fromStopText, 10, yPos);
  pdf.text(toStopText, 45, yPos);
  
  // Add arrow between stops
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(1);
  pdf.line(35, yPos - 2, 42, yPos - 2);
  // Arrow head
  pdf.line(40, yPos - 4, 42, yPos - 2);
  pdf.line(40, yPos, 42, yPos - 2);
  yPos += 12;

  // DATE AND TIME SECTION
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DATE', 10, yPos);
  pdf.text('TIME', 45, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(ticketData.date, 10, yPos);
  pdf.text(ticketData.time, 45, yPos);
  yPos += 12;

  // SEATS SECTION
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SEAT(S)', 10, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  const seatsText = ticketData.seats.join(', ');
  pdf.text(seatsText, 10, yPos);
  yPos += 12;

  // PASSENGER SECTION
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PASSENGER', 10, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  const passengerName = truncateText(ticketData.passengerName, 25);
  pdf.text(passengerName, 10, yPos);
  yPos += 5;
  pdf.text(`+91 ${ticketData.passengerPhone}`, 10, yPos);
  yPos += 15;

  // Separator line
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(1);
  pdf.line(8, yPos, 72, yPos);
  yPos += 10;

  // TOTAL AMOUNT SECTION
  pdf.setFillColor(0, 0, 0);
  pdf.rect(8, yPos - 2, 64, 12, 'F');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('TOTAL AMOUNT', 12, yPos + 6);
  pdf.text(`₹${ticketData.totalAmount}`, 68, yPos + 6, { align: 'right' });
  yPos += 18;

  // Reset text color to black
  pdf.setTextColor(0, 0, 0);

  // FOOTER SECTION
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Thank you for choosing DoonConnect', 40, yPos, { align: 'center' });
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('Smart City Bus Service', 40, yPos, { align: 'center' });
  yPos += 5;
  pdf.text('Keep this ticket until journey ends', 40, yPos, { align: 'center' });
  yPos += 10;

  // Terms and conditions
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Terms & Conditions:', 10, yPos);
  yPos += 4;
  pdf.setFont('helvetica', 'normal');
  pdf.text('• Ticket valid for single journey only', 10, yPos);
  yPos += 3;
  pdf.text('• No refund after journey starts', 10, yPos);
  yPos += 3;
  pdf.text('• Subject to bus availability', 10, yPos);
  yPos += 3;
  pdf.text('• Keep ticket safe during travel', 10, yPos);

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = `DoonConnect_Ticket_${ticketData.ticketId}_${timestamp}.pdf`;

  // Save the PDF
  pdf.save(filename);
};

// Helper function to truncate text
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}