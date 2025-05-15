
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToCSV = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  
  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Convert to Blob and save
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(blob, `${fileName}.xlsx`);
};

export const exportToPDF = (fileName: string, title: string, data: any[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
  
  // Add date
  doc.setFontSize(10);
  doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });
  
  // Extract headers and data from the first item
  const headers = Object.keys(data[0]);
  const rows = data.map(item => Object.values(item));
  
  // Create table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 30,
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    bodyStyles: { textColor: 0 },
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontStyle: 'normal',
      fontSize: 10
    },
  });
  
  // Save document
  doc.save(`${fileName}.pdf`);
};
