import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Function to export data to CSV
export const exportToCSV = (data: any[], filename: string) => {
  import('xlsx').then(XLSX => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }).catch(error => {
    console.error('Error loading xlsx library:', error);
  });
};

// Function to export data to PDF
export const exportToPDF = (filename: string, title: string, data: any[]) => {
  import('jspdf').then(jsPDF => {
    import('jspdf-autotable').then(autoTable => {
      const doc = new jsPDF.default('p', 'mm', 'a4');
      
      // Set RTL
      doc.setR2L(true);
      
      // Add title
      doc.setFontSize(18);
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.text(title, pageWidth / 2, 15, { align: 'center' });
      
      // Add date
      doc.setFontSize(12);
      doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}`, pageWidth / 2, 25, { align: 'center' });
      
      // Prepare table headers and rows
      const headers = Object.keys(data[0]);
      const rows = data.map(item => Object.values(item));
      
      // Add table
      autoTable.default(doc, {
        head: [headers],
        body: rows,
        startY: 35,
        headStyles: {
          fillColor: [67, 176, 42],
          textColor: [255, 255, 255],
          halign: 'center'
        },
        bodyStyles: {
          halign: 'center'
        },
        styles: {
          font: 'helvetica',
          fontStyle: 'normal'
        },
        theme: 'grid'
      });
      
      doc.save(`${filename}.pdf`);
    }).catch(error => {
      console.error('Error loading jspdf-autotable library:', error);
    });
  }).catch(error => {
    console.error('Error loading jspdf library:', error);
  });
};
