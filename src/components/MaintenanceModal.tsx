import React, { useState } from 'react';
import { InfrastructureAsset } from '../types';
import { X, Wrench, DollarSign, Calendar } from 'lucide-react';

interface MaintenanceModalProps {
  asset: InfrastructureAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onLog: (assetId: string, logData: {
    description: string;
    cost: number;
    technician: string;
    partsReplaced?: string;
    status?: string;
    nextScheduledDue?: string;
  }) => Promise<void>;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  asset,
  isOpen,
  onClose,
  onLog,
}) => {
  if (!isOpen || !asset) return null;

  const [description, setDescription] = useState('');
  const [cost, setCost] = useState<number>(150);
  const [technician, setTechnician] = useState('AgriTech Field Services');
  const [partsReplaced, setPartsReplaced] = useState('');
  const [status, setStatus] = useState<any>('Completed');
  const [nextScheduledDue, setNextScheduledDue] = useState(
    new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !technician) {
      alert('Description and Technician are required.');
      return;
    }

    try {
      setSubmitting(true);
      await onLog(asset.id, {
        description,
        cost,
        technician,
        partsReplaced,
        status,
        nextScheduledDue,
      });
      onClose();
    } catch (err: any) {
      alert('Error logging maintenance: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-stone-200 flex flex-col">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Wrench className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-base">Log Asset Maintenance</h3>
              <p className="text-xs text-emerald-200">
                {asset.name} • <span className="font-mono">{asset.assetCode}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Service / Repair Description *</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Submersible pump motor replacement, lubrication of bearings, and line pressure testing."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Service Cost (₦ Naira) *</label>
              <input
                type="number"
                min="0"
                step="500"
                required
                value={cost}
                onChange={e => setCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 font-bold text-stone-900 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Technician / Vendor *</label>
              <input
                type="text"
                required
                value={technician}
                onChange={e => setTechnician(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Parts Replaced / Installed</label>
            <input
              type="text"
              placeholder="e.g. 2x 50mm Brass Gate Valves, 1x Impeller"
              value={partsReplaced}
              onChange={e => setPartsReplaced(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Service Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-medium"
              >
                <option value="Completed">Completed (Operational)</option>
                <option value="Scheduled">Scheduled Inspection</option>
                <option value="Requires Follow-up">Requires Follow-up Parts</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Next Inspection Date</label>
              <input
                type="date"
                value={nextScheduledDue}
                onChange={e => setNextScheduledDue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-200 text-stone-700 font-semibold cursor-pointer hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Logging...' : 'Save Maintenance Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
