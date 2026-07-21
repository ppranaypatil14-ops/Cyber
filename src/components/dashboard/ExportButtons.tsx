import React from 'react';
import { FileDown, FileJson } from 'lucide-react';

interface ExportButtonsProps {
  incidents: any[];
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ incidents }) => {
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `incidents_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex gap-3">
      <button 
        onClick={handleExportJSON}
        className="flex-1 py-2.5 bg-[#030d09] hover:bg-emerald-900/20 text-slate-300 text-xs font-bold rounded-xl transition-all border border-emerald-500/20 flex items-center justify-center gap-2"
      >
        <FileJson className="w-4 h-4 text-emerald-400" />
        Export JSON
      </button>
      <button className="flex-1 py-2.5 bg-[#030d09] hover:bg-emerald-900/20 text-slate-300 text-xs font-bold rounded-xl transition-all border border-emerald-500/20 flex items-center justify-center gap-2">
        <FileDown className="w-4 h-4 text-emerald-400" />
        Export PDF
      </button>
    </div>
  );
};
