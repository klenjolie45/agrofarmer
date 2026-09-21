import React, { useState, useMemo } from 'react';
import { Farmer, Loan } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Trash2, 
  Edit, 
  DollarSign, 
  Sprout,
  ShieldCheck,
  Building
} from 'lucide-react';

interface FarmersViewProps {
  farmers: Farmer[];
  loans: Loan[];
  onOpenNewFarmer: () => void;
  onEditFarmer: (farmer: Farmer) => void;
  onDeleteFarmer: (id: string) => void;
  onSelectFarmer: (farmer: Farmer) => void;
  onApplyLoanForFarmer: (farmer: Farmer) => void;
}

export const FarmersView: React.FC<FarmersViewProps> = ({
  farmers,
  loans,
  onOpenNewFarmer,
  onEditFarmer,
  onDeleteFarmer,
  onSelectFarmer,
  onApplyLoanForFarmer,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedKyc, setSelectedKyc] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Derive unique regions for filter
  const regions = useMemo(() => {
    const set = new Set<string>();
    farmers.forEach(f => {
      if (f.region) set.add(f.region);
    });
    return Array.from(set);
  }, [farmers]);

  // Filtered farmers
  const filteredFarmers = useMemo(() => {
    return farmers.filter(f => {
      const matchSearch =
        !search ||
        f.fullName.toLowerCase().includes(search.toLowerCase()) ||
        f.farmerCode.toLowerCase().includes(search.toLowerCase()) ||
        f.phone.toLowerCase().includes(search.toLowerCase()) ||
        f.nationalId.toLowerCase().includes(search.toLowerCase()) ||
        f.cooperativeName.toLowerCase().includes(search.toLowerCase());

      const matchRegion = selectedRegion === 'all' || f.region.toLowerCase() === selectedRegion.toLowerCase();
      const matchKyc = selectedKyc === 'all' || f.kycStatus.toLowerCase() === selectedKyc.toLowerCase();
      const matchStatus = selectedStatus === 'all' || f.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchSearch && matchRegion && matchKyc && matchStatus;
    });
  }, [farmers, search, selectedRegion, selectedKyc, selectedStatus]);

  // Summary figures
  const totalFarmland = filteredFarmers.reduce((sum, f) => sum + (f.farmSizeHectares || 0), 0);
  const verifiedCount = filteredFarmers.filter(f => f.kycStatus === 'Verified').length;

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Farmer Code', 'Full Name', 'National ID', 'Phone', 'Region', 'District', 'Farm Size (ha)', 'Primary Crops', 'Cooperative', 'KYC Status', 'Credit Rating'];
    const rows = filteredFarmers.map(f => [
      f.farmerCode,
      `"${f.fullName}"`,
      f.nationalId,
      f.phone,
      `"${f.region}"`,
      `"${f.district}"`,
      f.farmSizeHectares,
      `"${f.primaryCrops.join(', ')}"`,
      `"${f.cooperativeName}"`,
      f.kycStatus,
      f.creditRating
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agricore_farmers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Farmer Registration & Member Directory</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
              {filteredFarmers.length} Total
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Registered smallholders, biometric KYC verifications, farm acreage, and crop profiles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            id="btn-register-farmer"
            onClick={onOpenNewFarmer}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Farmer</span>
          </button>
        </div>
      </div>

      {/* Stats Mini Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-500 uppercase">Filtered Farmers</div>
          <div className="text-lg font-bold text-stone-900">{filteredFarmers.length}</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-500 uppercase">Total Acreage</div>
          <div className="text-lg font-bold text-emerald-700">{totalFarmland.toFixed(1)} ha</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-500 uppercase">KYC Verified</div>
          <div className="text-lg font-bold text-emerald-800">
            {verifiedCount} ({Math.round((verifiedCount / (filteredFarmers.length || 1)) * 100)}%)
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-500 uppercase">Active Status</div>
          <div className="text-lg font-bold text-stone-900">
            {filteredFarmers.filter(f => f.status === 'Active').length} Active
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            id="input-search-farmers"
            type="text"
            placeholder="Search by name, farmer code (e.g. FRM-2026), phone, NIN, or cooperative..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters:</span>
          </div>

          {/* Region */}
          <select
            id="filter-farmer-region"
            value={selectedRegion}
            onChange={e => setSelectedRegion(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          >
            <option value="all">All Regions</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* KYC Status */}
          <select
            id="filter-farmer-kyc"
            value={selectedKyc}
            onChange={e => setSelectedKyc(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          >
            <option value="all">All KYC Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Account Status */}
          <select
            id="filter-farmer-status"
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Farmers Data Table / Card View */}
      {filteredFarmers.length > 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Farmer Profile</th>
                  <th className="py-3 px-4">Location / Zone</th>
                  <th className="py-3 px-4">Farm Details</th>
                  <th className="py-3 px-4">Primary Crops</th>
                  <th className="py-3 px-4">Cooperative / Bank</th>
                  <th className="py-3 px-4">KYC & Credit</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredFarmers.map(farmer => {
                  const farmerLoans = loans.filter(l => l.farmerId === farmer.id);
                  const activeLoan = farmerLoans.find(l => ['Approved', 'Disbursed', 'Repaying'].includes(l.status));

                  return (
                    <tr 
                      key={farmer.id} 
                      className="hover:bg-stone-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectFarmer(farmer)}
                    >
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900 text-sm">{farmer.fullName}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                            {farmer.farmerCode}
                          </span>
                          <span className="text-stone-400">•</span>
                          <span className="text-[11px] text-stone-500">{farmer.phone}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{farmer.region}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 pl-4">{farmer.district}</div>
                      </td>

                      {/* Farmland */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">
                          {farmer.farmSizeHectares} ha
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {farmer.ownershipStatus} • {farmer.irrigationType}
                        </div>
                      </td>

                      {/* Primary Crops */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {farmer.primaryCrops.map(crop => (
                            <span
                              key={crop}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-700 border border-stone-200"
                            >
                              {crop}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Cooperative */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-800 truncate max-w-[170px]" title={farmer.cooperativeName}>
                          {farmer.cooperativeName}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {farmer.bankName || 'No bank assigned'}
                        </div>
                      </td>

                      {/* KYC & Credit */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            farmer.kycStatus === 'Verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : farmer.kycStatus === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {farmer.kycStatus === 'Verified' && <CheckCircle2 className="w-2.5 h-2.5" />}
                            {farmer.kycStatus === 'Pending' && <Clock className="w-2.5 h-2.5" />}
                            <span>KYC {farmer.kycStatus}</span>
                          </span>

                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700">
                            Score: {farmer.creditRating}
                          </span>
                        </div>

                        {activeLoan ? (
                          <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                            Active Loan: ${activeLoan.outstandingBalance.toLocaleString()}
                          </div>
                        ) : (
                          <div className="text-[10px] text-stone-400 mt-1">No active credit</div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="Apply for Credit"
                            onClick={() => onApplyLoanForFarmer(farmer)}
                            className="p-1.5 rounded-md hover:bg-emerald-100 text-emerald-800 transition cursor-pointer"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Edit Farmer Profile"
                            onClick={() => onEditFarmer(farmer)}
                            className="p-1.5 rounded-md hover:bg-stone-200 text-stone-600 transition cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Delete Farmer"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${farmer.fullName}?`)) {
                                onDeleteFarmer(farmer.id);
                              }
                            }}
                            className="p-1.5 rounded-md hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center shadow-sm">
          <Sprout className="w-12 h-12 text-emerald-600 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-stone-900">No Farmers Found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            No farmer records matched your filter criteria. Try adjusting your search query or clear the filter selections.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedRegion('all');
              setSelectedKyc('all');
              setSelectedStatus('all');
            }}
            className="mt-4 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
