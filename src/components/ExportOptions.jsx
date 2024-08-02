// src/components/ExportOptions.jsx
import React from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ExportOptions = ({ chartRef }) => {
  const exportToPDF = async () => {
    const element = chartRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save("gantt-chart.pdf");
  };

  return (
    <button 
      onClick={exportToPDF}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Export to PDF
    </button>
  );
};

export default ExportOptions;