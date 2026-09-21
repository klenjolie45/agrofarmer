import React, { useState, useMemo } from 'react';
import { InfrastructureAsset } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Warehouse, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Users, 
  DollarSign, 
  Activity, 
  Calendar,
  Layers,
  ChevronRight,
  Droplets,
  Wind
} from 'lucide-react';

interface InfrastructureViewProps {
  infrastructure: InfrastructureAsset[];
  onOpenNewAsset: () => void;
  onSelectAsset: (asset: InfrastructureAsset) => void;
  onLogMaintenance: (asset: InfrastructureAsset) => void;
  onDeleteAsset: (id: string) => void;
}

export const InfrastructureView: React.FC<InfrastructureViewProps> = ({
  infrastructure,
  onOpenNewAsset,
  onSelectAsset,
  onLogMaintenance,
  onDeleteAsset,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    infrastructure.forEach(i => set.add(i.category));
    return Array.from(set);
  }, [infrastructure]);

  // Filtered
  const filteredAssets = useMemo(() => {
    return infrastructure.filter(i => {
      const matchSearch =
        !search ||
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.assetCode.toLowerCase().includes(search.toLowerCase()) ||
        i.district.toLowerCase().includes(search.toLowerCase()) ||
        i.custodianName.toLowerCase().includes(search.toLowerCase());

      const matchCat = selectedCategory === 'all' || i.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchCond = selectedCondition === 'all' || i.condition.toLowerCase() === selectedCondition.toLowerCase();

      return matchSearch && matchCat && matchCond;
    });
  }, [infrastructure, search, selectedCategory, selectedCondition]);

  // Aggregates
  const totalValue = filteredAssets.reduce((sum, i) => sum + (i.estimatedValueUsd || 0), 0);
  const totalBeneficiaries = filteredAssets.reduce((sum, i) => sum + (i.beneficiaryFarmersCount || 0), 0);
  const operationalCount = filteredAssets.filter(i => i.condition === 'Operational').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Agricultural Infrastructure & Machinery Registry</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
              {filteredAssets.length} Assets
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Community grain silos, solar deep-wells, processing plants, cold chains, and heavy mechanization.
          </p>
        </div>

        <button
          id="btn-add-asset"
          onClick={onOpenNewAsset}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Infrastructure</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-500 uppercase">Fleet Capital Valuation</div>
          <div className="text-xl font-bold text-stone-900 mt-0.5">${totalValue.toLocaleString()}</div>
          <div className="text-[11px] text-stone-400 mt-1">Total asset replacement value</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-500 uppercase">Beneficiary Farmers Reached</div>
          <div className="text-xl font-bold text-emerald-700 mt-0.5">{totalBeneficiaries.toLocaleString()} Smallholders</div>
          <div className="text-[11px] text-stone-400 mt-1">Utilizing community storage & water infrastructure</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-500 uppercase">Operational Fleet Availability</div>
          <div className="text-xl font-bold text-emerald-800 mt-0.5">
            {operationalCount} of {filteredAssets.length} ({filteredAssets.length > 0 ? Math.round((operationalCount / filteredAssets.length) * 100) : 0}%)
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Active and servicing rural cooperatives</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            id="input-search-infrastructure"
            type="text"
            placeholder="Search by asset name, code (INF-...), district, or custodian..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            id="filter-asset-category"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          >
            <option value="all">All Asset Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            id="filter-asset-condition"
            value={selectedCondition}
            onChange={e => setSelectedCondition(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          >
            <option value="all">All Operational Conditions</option>
            <option value="operational">Operational</option>
            <option value="needs maintenance">Needs Maintenance</option>
            <option value="critical repair">Critical Repair</option>
            <option value="under construction">Under Construction</option>
          </select>
        </div>
      </div>

      {/* Infrastructure Assets Grid */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssets.map(asset => {
            const isOperational = asset.condition === 'Operational';
            const isWarning = asset.condition === 'Needs Maintenance';

            return (
              <div
                key={asset.id}
                className="bg-white rounded-xl border border-stone-200 hover:border-emerald-500 shadow-sm transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5">
                  {/* Top Row: Code & Condition */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {asset.assetCode}
                      </span>
                      <span className="text-xs font-semibold text-stone-600">
                        {asset.category}
                      </span>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      isOperational
                        ? 'bg-emerald-100 text-emerald-800'
                        : isWarning
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isOperational && <CheckCircle2 className="w-3 h-3" />}
                      {isWarning && <AlertTriangle className="w-3 h-3" />}
                      <span>{asset.condition}</span>
                    </span>
                  </div>

                  {/* Asset Name */}
                  <h3 
                    onClick={() => onSelectAsset(asset)}
                    className="text-base font-bold text-stone-900 hover:text-emerald-700 transition cursor-pointer"
                  >
                    {asset.name}
                  </h3>

                  {/* Location & GPS */}
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{asset.district}, {asset.region}</span>
                    <span className="text-stone-300">•</span>
                    <span className="font-mono text-[10px] text-stone-400">{asset.gpsCoordinates}</span>
                  </div>

                  {/* Capacity & Live Utilization Bar */}
                  <div className="mt-4 p-3 rounded-lg bg-stone-50 border border-stone-100">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-stone-600 font-medium">Capacity: <strong>{asset.capacity}</strong></span>
                      <span className="font-bold text-stone-900">{asset.utilizationPercent}% Active Load</span>
                    </div>
                    <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          asset.utilizationPercent > 85 ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${asset.utilizationPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Custodian & Beneficiaries */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-stone-600">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-semibold">Custodian / Manager</span>
                      <div className="font-medium text-stone-800 truncate">{asset.custodianName}</div>
                      <div className="text-[11px] text-stone-500">{asset.custodianPhone}</div>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-semibold">Community Impact</span>
                      <div className="font-medium text-stone-800">{asset.beneficiaryFarmersCount} Farmers</div>
                      <div className="text-[11px] text-stone-500">Valued at ${asset.estimatedValueUsd.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Maintenance Notice */}
                  <div className="mt-3 text-[11px] text-stone-500 flex items-center justify-between border-t border-stone-100 pt-2.5">
                    <span>Last Service: {asset.lastMaintenanceDate}</span>
                    <span className={`font-semibold ${isWarning ? 'text-amber-700' : 'text-stone-600'}`}>
                      Next Due: {asset.nextMaintenanceDue}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="bg-stone-50 px-5 py-2.5 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => onLogMaintenance(asset)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Log Maintenance</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectAsset(asset)}
                      className="px-3 py-1 text-xs font-semibold rounded bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition cursor-pointer shadow-2xs"
                    >
                      View Logs ({asset.maintenanceLogs.length})
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to decommission ${asset.name}?`)) {
                          onDeleteAsset(asset.id);
                        }
                      }}
                      className="text-stone-400 hover:text-rose-600 transition cursor-pointer p-1 text-xs"
                      title="Decommission Asset"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center shadow-sm">
          <Warehouse className="w-12 h-12 text-emerald-600 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-stone-900">No Infrastructure Found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            No assets matched the current category or condition filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedCondition('all');
            }}
            className="mt-4 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
