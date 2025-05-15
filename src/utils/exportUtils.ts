
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
