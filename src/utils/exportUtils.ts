
/**
 * Export data to CSV file
 * @param fileName The name of the file to export to (without extension)
 * @param title The title of the export (included in CSV)
 * @param data The data to export
 */
export const exportToPDF = (fileName: string, title: string, data: any[]) => {
  // Since we're no longer using jsPDF, we'll create a CSV export
  // Convert data to CSV
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Get headers from the first data item
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  let csvContent = `${title}\n`;
  csvContent += headers.join(',') + '\n';
  
  // Add rows
  data.forEach(item => {
    const row = headers.map(header => {
      // Handle special cases (like commas, quotes in the data)
      let cell = item[header] !== null && item[header] !== undefined ? item[header] : '';
      cell = String(cell).replace(/"/g, '""'); // Escape quotes
      return `"${cell}"`;
    });
    csvContent += row.join(',') + '\n';
  });
  
  // Create a blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
