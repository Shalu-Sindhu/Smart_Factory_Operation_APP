import { useState, useEffect, FormEvent } from "react";
import { 
  FileSpreadsheet, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Calendar, 
  Printer, 
  Share2, 
  Clock,
  ShieldCheck,
  CircleAlert
} from "lucide-react";
import { generateReport, fetchReports } from "../utils/api.ts";

export default function ReportCenter() {
  const [reportType, setReportType] = useState("Shift Summary");
  const [format, setFormat] = useState("Excel");
  const [dateRange, setDateRange] = useState("Today");

  // State
  const [reportsList, setReportsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadPastReports = async () => {
    try {
      const data = await fetchReports();
      setReportsList(data);
    } catch (err) {
      console.error("Failed to load reports history", err);
    }
  };

  useEffect(() => {
    loadPastReports();
  }, []);

  const handleCreateReport = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        type: reportType,
        format,
        dateRange
      };
      
      const newReport = await generateReport(payload);
      
      setMessage(`Successfully generated operational report: ${newReport.title}`);
      
      // Reload reports history list
      await loadPastReports();
    } catch (err) {
      console.error("Error creating report:", err);
      setMessage("Error sending generation command. Check server status.");
    } finally {
      setLoading(false);
    }
  };

  // Helper icon for report type
  const getReportIcon = (type: string) => {
    if (type.includes("Safety")) return CircleAlert;
    if (type.includes("Downtime")) return Clock;
    return ShieldCheck;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-950 tracking-tight">Report Generator</h1>
          <p className="text-slate-500 text-sm mt-1">Compile comprehensive shift audits, safety compliance history logs, and workstation performance metrics into portable files.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Report configuration card panel (Col span 1) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-fit space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-display font-semibold text-base text-slate-950 flex items-center gap-1.5">
              <FileSpreadsheet className="h-4.5 w-4.5 text-cyan-600" />
              Configure Audit File
            </h2>
            <span className="text-xs text-slate-400">Specify data scope and target file architecture</span>
          </div>

          <form onSubmit={handleCreateReport} className="space-y-4 text-xs font-medium">
            {/* Type selector */}
            <div>
              <label className="text-slate-500 block mb-1.5">Aesthetic Target Subject</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="Shift Summary">Shift Summary Report (KPIs, Active headcount)</option>
                <option value="Safety Compliance Audit">Safety Compliance Audit (Helmet, Vest detections)</option>
                <option value="Productivity Index Report">Productivity & Cycle Timing Benchmark Audit</option>
                <option value="Equipment Downtime Report">Equipment Downtime & Workstation Idle Analysis</option>
              </select>
            </div>

            {/* Date range selector */}
            <div>
              <label className="text-slate-500 block mb-1.5">Date Span Scope</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="Today">Current Active Shift (Today)</option>
                <option value="Yesterday">Prior Shift (Yesterday)</option>
                <option value="Last 7 Days">Full Operational Week (Last 7 Days)</option>
                <option value="Last 30 Days">Monthly Cumulative Window (Last 30 Days)</option>
              </select>
            </div>

            {/* Format selector */}
            <div>
              <label className="text-slate-500 block mb-1.5 font-sans">Document File Format</label>
              <div className="grid grid-cols-3 gap-2.5">
                {["Excel", "PDF", "JSON"].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`py-2 px-1 rounded-xl font-bold transition-all border text-center cursor-pointer ${
                      format === fmt 
                        ? "bg-cyan-50 border-cyan-500 text-cyan-700 shadow-xs" 
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Generation Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-100 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin shrink-0" />
                  Generating Audit File...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Compile Report Document
                </>
              )}
            </button>
          </form>

          {/* Alert Message Banner */}
          {message && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-[11px] rounded-xl border border-emerald-100 text-center animate-fade-in font-medium">
              {message}
            </div>
          )}
        </div>

        {/* Reports list history panel (Col span 2) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:col-span-2 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div>
                <h2 className="font-display font-semibold text-base text-slate-950">Completed Report Archive</h2>
                <span className="text-xs text-slate-500">Log of compiled operational records available for download</span>
              </div>
              <button 
                onClick={loadPastReports}
                className="p-1.5 bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                title="Refresh logs archive"
              >
                <RefreshCw className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Report list */}
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {reportsList.map((report) => {
                const Icon = getReportIcon(report.title);
                return (
                  <div key={report.id} className="p-4 border border-slate-100 bg-slate-50/45 rounded-xl flex items-center justify-between hover:border-cyan-100 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white border border-slate-100 rounded-xl text-cyan-600 shadow-2xs">
                        <Icon className="h-4.5 w-4.5 text-cyan-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{report.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono font-medium mt-1">
                          <span>FORMAT: {report.format.toUpperCase()}</span>
                          <span>•</span>
                          <span>SCOPE: {report.dateRange.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Created date */}
                      <span className="text-[10px] text-slate-400 font-mono font-semibold hidden md:inline">{report.timestamp}</span>
                      
                      {/* Direct mock Download file handler */}
                      <a 
                        href={`data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(report, null, 2))}`}
                        download={`${report.title.replace(/\s+/g, '_').toLowerCase()}.${report.format.toLowerCase()}`}
                        className="p-2 bg-white border border-slate-200 hover:border-cyan-500 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50/10 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                );
              })}

              {reportsList.length === 0 && (
                <div className="text-center py-16 text-slate-400 text-xs font-medium">
                  No completed report compilations logged in active archive yet.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10px] text-slate-400 font-semibold mt-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-slate-400" />
              Retention: 90 Days Storage Archive Active
            </span>
            <span>Total: {reportsList.length} Files</span>
          </div>
        </div>

      </div>
    </div>
  );
}
