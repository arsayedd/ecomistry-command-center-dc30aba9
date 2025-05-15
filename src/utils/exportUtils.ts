
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToPDF = (
  fileName: string,
  title: string,
  data: any[]
) => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, doc.internal.pageSize.width / 2, 15, { align: "center" });
    
    // Generate table from data
    if (data && data.length > 0) {
      const headers = Object.keys(data[0]);
      const rows = data.map((item) => Object.values(item));
      
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 25,
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
      });
    }
    
    // Save document
    doc.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("Error exporting to PDF:", error);
  }
};

export const exportToCSV = (
  data: any[],
  fileName: string
) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    
    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    
    // Create blob and save
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    
    saveAs(blob, `${fileName}.xlsx`);
  } catch (error) {
    console.error("Error exporting to CSV:", error);
  }
};
