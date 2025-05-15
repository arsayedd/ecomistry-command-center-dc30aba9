
import { flatten } from 'flat';
import { utils, writeFile, WorkBook } from 'xlsx';

// Function to export data to CSV
export const exportToCSV = (data: any[], fileName: string) => {
  try {
    const formattedData = formatDataForExport(data);
    const worksheet = utils.json_to_sheet(formattedData);
    const workbook: WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    
    // Generate CSV file
    const csvOutput = utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${fileName}.csv`);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
  }
};

// Function to export data to Excel
export const exportToExcel = (data: any[], fileName: string) => {
  try {
    const formattedData = formatDataForExport(data);
    const worksheet = utils.json_to_sheet(formattedData);
    const workbook: WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    
    // Generate Excel file
    writeFile(workbook, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  }
};

// Helper function to format data for export
const formatDataForExport = (data: any[]): any[] => {
  return data.map(item => {
    const flattened = flatten(item);
    
    // Clean up nested object properties
    Object.keys(flattened).forEach(key => {
      if (key.includes('.')) {
        const newKey = key.split('.').pop() || key;
        flattened[newKey] = flattened[key];
        delete flattened[key];
      }
    });
    
    return flattened;
  });
};

// Helper function to download a blob
const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
