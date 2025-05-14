
/**
 * Exports data to CSV format.
 * @param filename The name of the file to export
 * @param title The title of the document
 * @param data The data to export
 */
export function exportToPDF(filename: string, title: string, data: any[]) {
  if (!data || data.length === 0) {
    console.error("No data to export");
    return;
  }
  
  // Create headers from the first object's keys
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  // Add data rows
  data.forEach(item => {
    const row = headers.map(header => {
      // Convert value to string and handle commas by wrapping in quotes
      const value = item[header] === null || item[header] === undefined ? '' : String(item[header]);
      return `"${value.replace(/"/g, '""')}"`;
    }).join(',');
    csvContent += row + '\n';
  });
  
  // Create blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}
