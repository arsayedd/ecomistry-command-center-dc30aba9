
/**
 * Export data to CSV file and trigger download
 * @param data Array of objects to export
 * @param filename Filename without extension
 */
export function exportToCSV(data: any[], filename: string): void {
  if (!data || !data.length) {
    console.error("No data to export");
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV rows from data
  const csvRows = [
    // Headers row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        const cell = row[header] ?? '';
        // Escape quotes and wrap in quotes if needed
        const cellStr = String(cell).replace(/"/g, '""');
        return cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n') 
          ? `"${cellStr}"`
          : cellStr;
      }).join(',')
    )
  ];

  // Join rows into a single string
  const csvContent = csvRows.join('\n');
  
  // Create a Blob containing the CSV data
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create a download link
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.display = 'none';
  
  // Add to DOM, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Free up the URL object
  URL.revokeObjectURL(url);
}
