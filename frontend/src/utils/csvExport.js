/**
 * Utility to export expenses array to CSV format and trigger browser download.
 * @param {Array} expenses List of expenses to export
 * @param {String} filename Output file name
 */
export const exportToCSV = (expenses, filename = 'expenses.csv') => {
  const headers = ['Amount (INR)', 'Category', 'Date', 'Note'];

  const rows = expenses.map(e => [
    e.amount,
    e.category,
    e.date,
    // Wrap notes in double quotes to handle commas, escape any existing double quotes
    `"${(e.note || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
