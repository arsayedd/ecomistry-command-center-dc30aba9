
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// Export data to CSV
export const exportToCSV = (data: any[], filename: string = 'data') => {
  try {
    // Convert data to CSV string
    let csvContent = '';
    
    // Get headers from first item
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      csvContent += headers.join(',') + '\n';
      
      // Add rows
      data.forEach(item => {
        const row = headers.map(header => {
          const value = item[header];
          // Handle undefined, null and objects
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          // Escape quotes and wrap strings with commas in quotes
          if (typeof value === 'string') {
            const escaped = value.replace(/"/g, '""');
            return /,/.test(escaped) ? `"${escaped}"` : escaped;
          }
          return value;
        }).join(',');
        csvContent += row + '\n';
      });
    }
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
    
    console.log(`Successfully exported ${data.length} records to ${filename}.csv`);
    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return false;
  }
};

// Export data to Excel
export const exportToExcel = (data: any[], filename: string = 'data') => {
  try {
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Create blob and download
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${filename}.xlsx`);
    
    console.log(`Successfully exported ${data.length} records to ${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};
