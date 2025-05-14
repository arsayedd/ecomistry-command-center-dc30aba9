
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
/**
 * Utility functions for exporting data in various formats
 */

/**
 * Export data to CSV file
 * @param data The data to export
 * @param fileName The name of the file to export to
 */
export const exportToCSV = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  const excelBuffer = XLSX.write(workbook, { bookType: 'csv', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(dataBlob, `${fileName}.csv`);
};

/**
 * Export data to Excel file
 * @param data The data to export
 * @param fileName The name of the file to export to
 */
export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(dataBlob, `${fileName}.xlsx`);
};

/**
 * Export data to PDF file
 * @param fileName The name of the file to export to
 * @param title The title to display on the PDF
 * @param data The data to export
 */
export const exportToPDF = (fileName: string, title: string, data: any[]) => {
  // Create a new jsPDF instance
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
  
  // Get headers and columns dynamically from first data item
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    const rows = data.map(item => Object.values(item));
    
    // Add table - need to cast to any to access autoTable
    (doc as any).autoTable({
      head: [headers],
      body: rows,
      startY: 25,
      theme: 'grid',
      styles: { 
        font: 'helvetica',
        fontSize: 10
      },
      headStyles: {
        fillColor: [75, 75, 75],
        textColor: 255
      }
    });
  } else {
    doc.setFontSize(12);
    doc.text('No data available', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
  }
  
  // Save PDF
  doc.save(`${fileName}.pdf`);
};
