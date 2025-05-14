// إضافة وظيفة تصدير بصيغة PDF
export const exportToPDF = (data: any[], fileName: string) => {
  try {
    // استخدام مكتبة jspdf و jspdf-autotable
    const { jsPDF } = require("jspdf");
    const autoTable = require("jspdf-autotable").default;
    
    const doc = new jsPDF();
    
    // تحديد العنوان
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(fileName, 14, 15);
    
    // إعداد البيانات للجدول
    const headers = Object.keys(data[0]);
    const rows = data.map(item => Object.values(item));
    
    // إنشاء الجدول
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20
    });
    
    // حفظ الملف
    doc.save(`${fileName}.pdf`);
    
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('حدث خطأ أثناء تصدير البيانات إلى PDF');
  }
};

export const exportToCSV = (data: any[], fileName: string) => {
  try {
    const { utils, writeFile } = require("xlsx");
    
    // تحويل البيانات إلى جدول بيانات
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    
    // حفظ الملف
    writeFile(workbook, `${fileName}.csv`);
    
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    alert('حدث خطأ أثناء تصدير البيانات إلى CSV');
  }
};
