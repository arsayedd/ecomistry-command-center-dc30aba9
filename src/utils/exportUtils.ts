
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
 * @param data The data to export
 * @param columns The columns to export
 * @param fileName The name of the file to export to
 */
export const exportToPDF = (data: any[], columns: {header: string, dataKey: string}[], fileName: string) => {
  const doc = new jsPDF();
  doc.autoTable({
    head: [columns.map(column => column.header)],
    body: data.map(row => columns.map(column => row[column.dataKey])),
  });
  doc.save(`${fileName}.pdf`);
};
