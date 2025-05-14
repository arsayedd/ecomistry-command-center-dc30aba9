
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Add type declarations for jsPDF-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToPDF = (data: any[], title: string, columns: { header: string; dataKey: string }[]) => {
  const doc = new jsPDF('landscape');
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Convert data to array of arrays for autotable
  const tableData = data.map(item => {
    return columns.map(column => {
      // Handle nested properties with dot notation (e.g. "user.full_name")
      if (column.dataKey.includes('.')) {
        const parts = column.dataKey.split('.');
        let value = item;
        for (const part of parts) {
          value = value?.[part];
          if (value === undefined || value === null) break;
        }
        return value || '';
      }
      return item[column.dataKey] || '';
    });
  });
  
  // Add table
  doc.autoTable({
    startY: 30,
    head: [columns.map(col => col.header)],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { 
      font: 'helvetica', 
      fontSize: 10,
      overflow: 'linebreak',
      cellPadding: 3,
      halign: 'right' // Right-align for Arabic
    },
  });
  
  // Save PDF
  doc.save(`${title}.pdf`);
};

export const exportToExcel = (data: any[], title: string, columns: { header: string; dataKey: string }[]) => {
  // Convert data to worksheet format
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(item => {
      const row: Record<string, any> = {};
      columns.forEach(column => {
        // Handle nested properties with dot notation
        if (column.dataKey.includes('.')) {
          const parts = column.dataKey.split('.');
          let value = item;
          for (const part of parts) {
            value = value?.[part];
            if (value === undefined || value === null) break;
          }
          row[column.header] = value || '';
        } else {
          row[column.header] = item[column.dataKey] || '';
        }
      });
      return row;
    })
  );
  
  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title);
  
  // Save Excel file
  XLSX.writeFile(workbook, `${title}.xlsx`);
};
