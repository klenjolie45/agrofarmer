import React from 'react';
import { AnalyticsData, Loan, InfrastructureAsset } from '../types';
import { 
  Users, 
  DollarSign, 
  Warehouse, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  Layers, 
  ArrowUpRight,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  analyticsData: AnalyticsData | null;
  loans: Loan[];
  infrastructure: InfrastructureAsset[];
  onNavigateTab: (tab: 'farmers' | 'loans' | 'infrastructure' | 'audit') => void;
  onOpenNewFarmer: () => void;
  onOpenNewLoan: () => void;
  onSelectLoan: (loan: Loan) => void;
  onSelectAsset: (asset: InfrastructureAsset) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  analyticsData,
  loans,
  infrastructure,
  onNavigateTab,
  onOpenNewFarmer,
  onOpenNewLoan,
  onSelectLoan,
  onSelectAsset,
}) => {
  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-stone-600 font-medium">Loading AgriCore operational metrics...</p>
        </div>
      </div>
    );
  }

  const { summary, analytics } = analyticsData;
  const pendingLoans = loans.filter(l => l.status === 'Pending');
  const maintenanceAssets = infrastructure.filter(i => i.condition === 'Needs Maintenance' || i.condition === 'Critical Repair');

  // Naira values with fallbacks
  const disbursedNaira = summary.totalCapitalDisbursedNaira || summary.totalCapitalDisbursedUsd || 0;
  const repaidNaira = summary.totalRepaidNaira || summary.totalRepaidUsd || 0;
  const outstandingNaira = summary.outstandingDebtNaira || summary.outstandingDebtUsd || 0;
  const infraValueNaira = summary.infrastructureValueNaira || summary.infrastructureValueUsd || 0;

  // Chart data calculations
  const totalLoanVol = (repaidNaira + outstandingNaira) || 1;
  const repaidPercent = Math.round((repaidNaira / totalLoanVol) * 100);
  const outstandingPercent = 100 - repaidPercent;

  return (
    <div className="space-y-6">
      {/* Welcome & System Status Bar */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-xl p-6 text-white shadow-sm border border-emerald-700/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-700/80 text-emerald-200 border border-emerald-600">
                Live Operations
              </span>
              <span className="text-xs text-emerald-300">Agricultural Season 2026 • Nigeria</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Agricultural Portfolio Overview</h2>
            <p className="text-sm text-emerald-200/90 mt-1 max-w-2xl">
              Monitoring {summary.totalFarmers} registered farmers cultivating {summary.totalHectaresCultivated.toLocaleString()} hectares, ₦{disbursedNaira.toLocaleString()} in active agricultural credit, and {summary.totalInfrastructureAssets} regional storage & irrigation hubs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-dash-register-farmer"
              onClick={onOpenNewFarmer}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold text-xs shadow transition cursor-pointer flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Register Farmer</span>
            </button>
            <button
              id="btn-dash-apply-loan"
              onClick={onOpenNewLoan}
              className="px-4 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-950 text-white font-semibold text-xs border border-emerald-600 transition cursor-pointer flex items-center gap-1.5"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-300" />
              <span>New Loan (₦)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Registered Farmers */}
        <div 
          id="kpi-card-farmers"
          onClick={() => onNavigateTab('farmers')}
          className="bg-white rounded-xl p-5 border border-stone-200 hover:border-emerald-500 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Farmers Registered</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">{summary.totalFarmers}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {summary.activeFarmers} Active
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>{summary.totalHectaresCultivated} ha Farmland</span>
            <span className="text-emerald-700 font-medium flex items-center">
              View List <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Capital Disbursed & Recovery */}
        <div 
          id="kpi-card-loans"
          onClick={() => onNavigateTab('loans')}
          className="bg-white rounded-xl p-5 border border-stone-200 hover:border-emerald-500 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Capital Disbursed</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">₦{disbursedNaira.toLocaleString()}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {summary.repaymentRatePercent}% Repaid
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Outstanding: ₦{outstandingNaira.toLocaleString()}</span>
            <span className="text-emerald-700 font-medium flex items-center">
              Loans <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 3: Infrastructure Assets */}
        <div 
          id="kpi-card-infrastructure"
          onClick={() => onNavigateTab('infrastructure')}
          className="bg-white rounded-xl p-5 border border-stone-200 hover:border-emerald-500 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Infrastructure Assets</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">{summary.totalInfrastructureAssets}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {summary.operationalInfrastructureCount} Operational
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Valued at ₦{infraValueNaira.toLocaleString()}</span>
            <span className="text-emerald-700 font-medium flex items-center">
              Assets <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 4: Action / Approvals Queue */}
        <div 
          id="kpi-card-queue"
          onClick={() => onNavigateTab('loans')}
          className="bg-white rounded-xl p-5 border border-stone-200 hover:border-amber-500 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Pending Actions</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">{summary.pendingLoanApplications}</span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
              Credit Review
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>{maintenanceAssets.length} Assets Need Service</span>
            <span className="text-amber-700 font-medium flex items-center">
              Review <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics & Operational Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Credit Flow / Loan Performance Bar */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-stone-900">Loan Portfolio Recovery</h3>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Healthy ({summary.repaymentRatePercent}%)
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Real-time ratio between total collected repayments vs active debt in Naira.
            </p>

            {/* Split Visual Meter */}
            <div className="space-y-2 mb-4">
              <div className="h-4 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
                <div 
                  className="bg-emerald-600 h-full transition-all duration-500" 
                  style={{ width: `${repaidPercent}%` }}
                  title={`Collected: ₦${repaidNaira.toLocaleString()} (${repaidPercent}%)`}
                ></div>
                <div 
                  className="bg-amber-500 h-full transition-all duration-500" 
                  style={{ width: `${outstandingPercent}%` }}
                  title={`Outstanding: ₦${outstandingNaira.toLocaleString()} (${outstandingPercent}%)`}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>Repaid: <strong>₦{repaidNaira.toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Balance: <strong>₦{outstandingNaira.toLocaleString()}</strong></span>
                </div>
              </div>
            </div>

            {/* Loan Purpose Breakdown */}
            <div className="mt-4 pt-3 border-t border-stone-100">
              <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">Financing Purpose</h4>
              <div className="space-y-2">
                {Object.entries(analytics.loansByPurpose).map(([purpose, data]) => (
                  <div key={purpose} className="flex items-center justify-between text-xs">
                    <span className="text-stone-600 truncate max-w-[180px]">{purpose}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">₦{data.totalAmount.toLocaleString()}</span>
                      <span className="text-stone-400">({data.count})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              onClick={() => onNavigateTab('loans')}
              className="w-full py-1.5 text-xs text-emerald-800 hover:text-emerald-950 font-semibold bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer text-center"
            >
              Open Loan Management Pipeline →
            </button>
          </div>
        </div>

        {/* Regional Farmer Distribution */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-stone-900">Regional Farmer Clusters</h3>
              <span className="text-xs text-stone-500">
                {Object.keys(analytics.regionalDistribution).length} Regions
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Geographical distribution of registered smallholder producers.
            </p>

            <div className="space-y-3">
              {Object.entries(analytics.regionalDistribution).map(([region, count]) => {
                const percent = Math.round((count / (summary.totalFarmers || 1)) * 100);
                return (
                  <div key={region} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-stone-700">{region}</span>
                      <span className="text-stone-500">{count} farmers ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Primary Crops Tag Cloud */}
            <div className="mt-5 pt-3 border-t border-stone-100">
              <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">Top Cultivated Crops</h4>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(analytics.cropCounts).map(([crop, count]) => (
                  <span
                    key={crop}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                  >
                    <span>{crop}</span>
                    <span className="w-4 h-4 rounded-full bg-emerald-200/80 text-emerald-900 text-[10px] flex items-center justify-center font-bold">
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              onClick={() => onNavigateTab('farmers')}
              className="w-full py-1.5 text-xs text-emerald-800 hover:text-emerald-950 font-semibold bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer text-center"
            >
              Browse Complete Farmer Directory →
            </button>
          </div>
        </div>

        {/* Infrastructure Asset Health & Urgent Attention */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-stone-900">Infrastructure Health</h3>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                ₦{(infraValueNaira / 1000000).toFixed(1)}M Assets
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              Operational condition of community grain silos, solar wells, and machinery.
            </p>

            {/* Condition Badges Breakdown */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                <div className="text-lg font-bold text-emerald-800">{analytics.infraConditions['Operational'] || 0}</div>
                <div className="text-[11px] font-medium text-emerald-700 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Fully Operational
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-center">
                <div className="text-lg font-bold text-amber-800">{analytics.infraConditions['Needs Maintenance'] || 0}</div>
                <div className="text-[11px] font-medium text-amber-700 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Needs Service
                </div>
              </div>
            </div>

            {/* Urgent Maintenance Needed Items */}
            <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">Service Watchlist</h4>
            {maintenanceAssets.length > 0 ? (
              <div className="space-y-2">
                {maintenanceAssets.map(asset => (
                  <div
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 transition-colors cursor-pointer text-xs flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <div className="font-semibold text-stone-800 truncate">{asset.name}</div>
                      <div className="text-stone-500 text-[11px]">Due: {asset.nextMaintenanceDue} • {asset.category}</div>
                    </div>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-200 text-amber-900 whitespace-nowrap">
                      Inspect
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-stone-500 bg-stone-50 rounded-lg">
                All infrastructure assets are currently operational.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              onClick={() => onNavigateTab('infrastructure')}
              className="w-full py-1.5 text-xs text-emerald-800 hover:text-emerald-950 font-semibold bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer text-center"
            >
              Manage Infrastructure Fleet →
            </button>
          </div>
        </div>
      </div>

      {/* Action Center: Pending Loan Approvals Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span>Loan Applications Awaiting Review</span>
              {pendingLoans.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  {pendingLoans.length} Pending
                </span>
              )}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Review farmer creditworthiness, requested capital, collateral, and execute approvals.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('loans')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Loans</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingLoans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Loan ID</th>
                  <th className="py-3 px-4">Farmer / Borrower</th>
                  <th className="py-3 px-4">Purpose</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Risk Rating</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {pendingLoans.map(loan => (
                  <tr key={loan.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-stone-900">
                      {loan.loanCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">{loan.farmerName}</div>
                      <div className="text-[11px] text-stone-500">{loan.farmerPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">{loan.purpose}</td>
                    <td className="py-3 px-4 font-bold text-stone-900">
                      ₦{loan.amountRequested.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        loan.riskAssessment === 'Low Risk'
                          ? 'bg-emerald-100 text-emerald-800'
                          : loan.riskAssessment === 'Moderate Risk'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {loan.riskAssessment}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-500">{loan.applicationDate}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectLoan(loan)}
                        className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
                      >
                        Review & Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-stone-800">All Loan Applications Cleared</p>
            <p className="text-xs text-stone-500 mt-1">There are no pending loan requests awaiting approval at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};
