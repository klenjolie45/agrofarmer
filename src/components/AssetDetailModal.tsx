import React from 'react';
import { InfrastructureAsset } from '../types';
import { 
  X, 
  Warehouse, 
  MapPin, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Users, 
  DollarSign, 
  Phone,
  Layers,
  Activity
} from 'lucide-react';

interface AssetDetailModalProps {
  asset: InfrastructureAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onLogMaintenance: (asset: InfrastructureAsset) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  isOpen,
  onClose,
  onLogMaintenance,
}) => {
  if (!isOpen || !asset) return null;

  const isOperational = asset.condition === 'Operational';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{asset.name}</h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                {asset.assetCode}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-200 mt-0.5">
              <span>{asset.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {asset.district}, {asset.region}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Condition Status</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isOperational ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                <span className="font-bold text-stone-900">{asset.condition}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Capacity</span>
              <div className="font-bold text-stone-900 text-sm mt-0.5 truncate">{asset.capacity}</div>
              <span className="text-[10px] text-stone-400">{asset.utilizationPercent}% In Use</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Beneficiaries</span>
              <div className="font-bold text-stone-900 text-sm mt-0.5">{asset.beneficiaryFarmersCount} Farmers</div>
              <span className="text-[10px] text-stone-400">Cooperative Hub</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Asset Valuation</span>
              <div className="font-bold text-emerald-800 text-sm mt-0.5">₦{(asset.estimatedValueUsd || 0).toLocaleString()}</div>
              <span className="text-[10px] text-stone-400">Replacement Cost</span>
            </div>
          </div>

          {/* Utilization Bar */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-stone-700">Active Utilization & Storage Load</span>
              <span className="font-bold text-stone-900">{asset.utilizationPercent}%</span>
            </div>
            <div className="h-2.5 w-full bg-stone-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  asset.utilizationPercent > 85 ? 'bg-amber-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${asset.utilizationPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Custodian & Specs */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold block">Assigned Custodian</span>
              <p className="font-semibold text-stone-800 mt-0.5">{asset.custodianName}</p>
              <div className="text-stone-500 text-[11px]">{asset.custodianType} • {asset.custodianPhone}</div>
            </div>

            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold block">Service Schedule</span>
              <p className="text-stone-800 font-medium mt-0.5">Last Checked: {asset.lastMaintenanceDate}</p>
              <div className="text-amber-700 font-semibold text-[11px]">Next Inspection Due: {asset.nextMaintenanceDue}</div>
            </div>

            {asset.specifications && (
              <div className="sm:col-span-2 pt-2 border-t border-stone-200">
                <span className="text-stone-400 text-[10px] uppercase font-bold block">Technical Architecture</span>
                <p className="text-stone-700 mt-0.5">{asset.specifications}</p>
              </div>
            )}
          </div>

          {/* Maintenance Logs Timeline */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">Service & Repair History</h4>
              <button
                onClick={() => onLogMaintenance(asset)}
                className="px-3 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Log New Service</span>
              </button>
            </div>

            {asset.maintenanceLogs.length > 0 ? (
              <div className="space-y-2">
                {asset.maintenanceLogs.map(log => (
                  <div key={log.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-900">{log.description}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {log.date} by {log.technician} • Cost: <strong>₦{log.cost.toLocaleString()}</strong>
                      </div>
                      {log.partsReplaced && (
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          Replaced: {log.partsReplaced}
                        </div>
                      )}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-stone-200 text-center text-stone-500">
                No maintenance records logged for this asset yet.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 flex items-center justify-between">
          <span className="text-stone-500">Commissioned: {asset.installationDate}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
