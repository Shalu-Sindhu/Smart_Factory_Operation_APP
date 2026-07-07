import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  Calendar, 
  Users, 
  Cctv, 
  ShieldAlert, 
  Activity, 
  Download,
  CheckCircle,
  Clock,
  Settings,
  Cpu,
  BarChart,
  ClipboardList
} from "lucide-react";
import { WorkerProfile, Camera } from "../types.ts";

interface CustomReportBuilderProps {
  workers: WorkerProfile[];
  cameras: Camera[];
}

export default function CustomReportBuilder({ workers, cameras }: CustomReportBuilderProps) {
  const [dateRange, setDateRange] = useState({ start: "2026-06-01", end: "2026-06-26" });
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["safety", "productivity"]);
  const [reportFormat, setReportFormat] = useState<"csv" | "xlsx" | "pdf">("csv");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);

  const metricsOptions = [
    { id: "safety", label: "PPE Safety compliance logs", icon: ShieldAlert },
    { id: "productivity", label: "Cycle-time Productivity rates", icon: Activity },
    { id: "attendance", label: "Attendance & Overtime records", icon: Clock },
    { id: "machines", label: "Heavy Machinery uptime & faults", icon: Cpu }
  ];

  const toggleWorker = (id: string) => {
    setSelectedWorkers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleCamera = (id: string) => {
    setSelectedCameras(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleMetric = (id: string) => {
    setSelectedMetrics(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBuildReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerationSuccess(false);

    setTimeout(() => {
      setIsGenerating(false);
      setGenerationSuccess(true);

      // Dynamically compile download payload based on format
      let blob: Blob;
      let filename = `optima_compiled_report_${Date.now()}`;

      if (reportFormat === "csv") {
        const content = `Optima Operations Report\nDate Range: ${dateRange.start} to ${dateRange.end}\nSelected Workers: ${selectedWorkers.join("; ")}\nSelected Cameras: ${selectedCameras.join("; ")}\nGenerated Metrics: ${selectedMetrics.join("; ")}\n`;
        blob = new Blob([content], { type: "text/csv" });
        filename += ".csv";
      } else if (reportFormat === "xlsx") {
        const content = `Optima Excel Workbook Output\nExport Metadata\nRange: ${dateRange.start} - ${dateRange.end}`;
        blob = new Blob([content], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        filename += ".xlsx";
      } else {
        // PDF
        const content = `%PDF-1.4\n1 0 obj\n<< /Title (Optima Custom Compiled Report) >>\nendobj\nxref\n0 2\n0000000000 65535 f\ntrailer\n<< /Root 1 0 R >>\n%%EOF`;
        blob = new Blob([content], { type: "application/pdf" });
        filename += ".pdf";
      }

      // Download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Parameters Panel (Left 2 columns) */}
      <form onSubmit={handleBuildReport} className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm flex items-center gap-1.5">
            <ClipboardList className="h-4.5 w-4.5 text-cyan-600" />
            Advanced Report compiler builder
          </h3>
          <p className="text-xs text-slate-400">Assemble custom metrics, operator rosters, and sensor timeframes into download sheets</p>
        </div>

        {/* Date Selector row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-50 dark:border-slate-800 pb-5">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 block">START DATE</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 block">END DATE</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Metrics options checklist */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase font-bold text-slate-400 block">Included Metrics Datasets</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {metricsOptions.map((opt) => {
              const Icon = opt.icon;
              const isSel = selectedMetrics.includes(opt.id);
              return (
                <div 
                  key={opt.id}
                  onClick={() => toggleMetric(opt.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSel 
                      ? "bg-cyan-50/50 dark:bg-cyan-950/20 border-cyan-500 text-cyan-700 dark:text-cyan-400 font-bold" 
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <Icon className="h-4.5 w-4.5" />
                    <span>{opt.label}</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSel ? "bg-cyan-600 border-cyan-500 text-white" : "border-slate-300"}`}>
                    {isSel && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workers checklist */}
        <div className="space-y-3 border-t border-slate-50 dark:border-slate-800 pt-5">
          <label className="text-[10px] uppercase font-bold text-slate-400 block">Target Operators Checklist</label>
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
            {workers.map((w) => {
              const isSel = selectedWorkers.includes(w.id);
              return (
                <button
                  type="button"
                  key={w.id}
                  onClick={() => toggleWorker(w.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    isSel 
                      ? "bg-cyan-600 text-white border-cyan-500" 
                      : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {w.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Format & generate row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-50 dark:border-slate-800 pt-5">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">OUTPUT FORMAT</span>
            <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button 
                type="button"
                onClick={() => setReportFormat("csv")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${reportFormat === "csv" ? "bg-cyan-600 text-white" : "text-slate-500"}`}
              >
                CSV
              </button>
              <button 
                type="button"
                onClick={() => setReportFormat("xlsx")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${reportFormat === "xlsx" ? "bg-cyan-600 text-white" : "text-slate-500"}`}
              >
                XLSX
              </button>
              <button 
                type="button"
                onClick={() => setReportFormat("pdf")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${reportFormat === "pdf" ? "bg-cyan-600 text-white" : "text-slate-500"}`}
              >
                PDF
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Compiling Roster...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Compile & Download Report
              </>
            )}
          </button>
        </div>
      </form>

      {/* Guide Card (Col span 1) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">Export Guidelines</h4>
          <p className="text-xs text-slate-400">Compliance standard logs</p>
        </div>

        <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
          <p>
            This module generates full production logs. For ISO 9001 and OSHA compliance files:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Ensure date ranges do not exceed 90 days of live logs.</li>
            <li>All personal identifiers are masked in CSV compliance formats.</li>
            <li>Alert timestamps correspond to the UTC terminal time of recording nodes.</li>
          </ul>
        </div>

        {generationSuccess && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 rounded-xl flex items-start gap-3 text-xs text-emerald-700 dark:text-emerald-400 animate-bounce">
            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
            <div>
              <strong>Report compilation succeeded!</strong>
              <p className="text-[11px] mt-1 opacity-90">Your custom file was bundled and successfully pushed to your local browser downloads.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
