import React, { useState } from 'react';
import { AuditLog } from '../types';
import { 
  ClipboardList, 
  Download, 
  RotateCcw, 
  Server, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ExternalLink,
  Layers,
  FileCode
} from 'lucide-react';
import { api } from '../api';

interface AuditLogsViewProps {
  logs: AuditLog[];
  onRefresh: () => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs, onRefresh }) => {
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [filterCategory, setFilterCategory] = useState('ALL');

  const filteredLogs = logs.filter(l => filterCategory === 'ALL' || l.category === filterCategory);

  const handleResetData = async () => {
    if (!window.confirm('Are you sure you want to reset all records back to the initial sample seed data? Current unsaved modifications will be replaced.')) {
      return;
    }
    try {
      setResetting(true);
      await api.resetSeedData();
      setResetSuccess(true);
      onRefresh();
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (err: any) {
      alert('Failed to reset: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick System Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>System Audit Trail & Deployment Center</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Immutable operation logs, database snapshots, and Render cloud deployment specifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={api.exportDatabaseUrl()}
            download="agricore_backup.json"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export Database JSON</span>
          </a>

          <button
            onClick={handleResetData}
            disabled={resetting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Resetting...' : 'Restore Seed Data'}</span>
          </button>
        </div>
      </div>

      {resetSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Database successfully reseeded with initial sample farmers, loans, and infrastructure assets.</span>
        </div>
      )}

      {/* Deployment on Render Guide Card */}
      <div className="bg-gradient-to-br from-stone-900 to-emerald-950 rounded-xl p-5 text-white border border-emerald-800/80 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60 mb-4">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold tracking-tight">Ready for Deployment on Render (Web Service)</h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-800 text-emerald-200 border border-emerald-600">
            Node.js 22 • Production Mode
          </span>
        </div>

        <p className="text-xs text-stone-300 mb-4 leading-relaxed">
          This system includes a unified full-stack architecture. In development, Vite serves the frontend while routing API calls. In production on Render, Express serves the pre-compiled static frontend from <code className="text-emerald-300 bg-emerald-950 px-1 py-0.5 rounded">dist/</code> and exposes all agricultural endpoints with file-based atomic persistence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-stone-950/70 border border-emerald-800/40">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">1. Build Command</span>
            <code className="font-mono text-stone-200 text-[11px] block bg-stone-900 px-2 py-1 rounded">npm install && npm run build</code>
          </div>

          <div className="p-3 rounded-lg bg-stone-950/70 border border-emerald-800/40">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">2. Start Command</span>
            <code className="font-mono text-stone-200 text-[11px] block bg-stone-900 px-2 py-1 rounded">npm start</code>
          </div>

          <div className="p-3 rounded-lg bg-stone-950/70 border border-emerald-800/40">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">3. Render Config</span>
            <code className="font-mono text-stone-200 text-[11px] block bg-stone-900 px-2 py-1 rounded">render.yaml included</code>
          </div>
        </div>
      </div>

      {/* Filter Category Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-stone-500">Filter Event Type:</span>
          {['ALL', 'FARMER', 'LOAN', 'INFRASTRUCTURE', 'SYSTEM'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                filterCategory === cat
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-xs text-stone-500">{filteredLogs.length} Events Logged</span>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4">Actor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.category === 'FARMER'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.category === 'LOAN'
                        ? 'bg-blue-100 text-blue-800'
                        : log.category === 'INFRASTRUCTURE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-stone-900">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-medium text-stone-800">
                    {log.entityName || '-'}
                  </td>
                  <td className="py-3 px-4 text-stone-600 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                    {log.performedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
