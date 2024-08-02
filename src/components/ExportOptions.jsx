import React from 'react';
import { useSelector } from 'react-redux';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ExportOptions = ({ chartRef }) => {
  const tasks = useSelector(state => state.tasks);

  const exportToPDF = async () => {
    const input = chartRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("gantt-chart.pdf");
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Name,Start Date,End Date,Progress\n"
      + tasks.map(task => {
          return `${task.id},${task.name},${task.start.toISOString()},${task.end.toISOString()},${task.progress}`;
        }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "gantt_tasks.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="export-options">
      <button onClick={exportToPDF} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
        Export to PDF
      </button>
      <button onClick={exportToCSV} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Export to CSV
      </button>
    </div>
  );
};

export default ExportOptions;