import React from 'react';
import { Sprout, Users, DollarSign, Warehouse, ClipboardList, PlusCircle, Database, CheckCircle2 } from 'lucide-react';

export type NavTab = 'dashboard' | 'farmers' | 'loans' | 'infrastructure' | 'audit';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenNewFarmer: () => void;
  onOpenNewLoan: () => void;
  onOpenNewAsset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewFarmer,
  onOpenNewLoan,
  onOpenNewAsset,
}) => {
  return (
    <header className="bg-emerald-900 text-white border-b border-emerald-800 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3.5 border-b border-emerald-800/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-700/80 flex items-center justify-center text-emerald-100 ring-1 ring-emerald-500/30 shadow-inner">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">AgriCore</h1>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-800 text-emerald-300 border border-emerald-700">
                  Management System
                </span>
              </div>
              <p className="text-xs text-emerald-300/90 font-medium">
                Farmer Registration • Micro-Loans • Infrastructure Assets
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/60 text-xs text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>DB Connected</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/60 text-xs text-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Render Ready</span>
            </div>

            <div className="h-4 w-px bg-emerald-800 hidden sm:block"></div>

            {/* Quick Action Buttons */}
            <button
              id="btn-quick-new-farmer"
              onClick={onOpenNewFarmer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register Farmer</span>
            </button>

            <button
              id="btn-quick-new-loan"
              onClick={onOpenNewLoan}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/70 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-300" />
              <span>Apply Loan</span>
            </button>

            <button
              id="btn-quick-new-asset"
              onClick={onOpenNewAsset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/70 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Warehouse className="w-3.5 h-3.5 text-emerald-300" />
              <span>Add Asset</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
          <button
            id="nav-tab-dashboard"
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-emerald-800/90 text-white shadow-sm ring-1 ring-emerald-600/50'
                : 'text-emerald-200/90 hover:bg-emerald-800/50 hover:text-white'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Dashboard & Analytics</span>
          </button>

          <button
            id="nav-tab-farmers"
            onClick={() => onSelectTab('farmers')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              currentTab === 'farmers'
                ? 'bg-emerald-800/90 text-white shadow-sm ring-1 ring-emerald-600/50'
                : 'text-emerald-200/90 hover:bg-emerald-800/50 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Farmer Directory</span>
          </button>

          <button
            id="nav-tab-loans"
            onClick={() => onSelectTab('loans')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              currentTab === 'loans'
                ? 'bg-emerald-800/90 text-white shadow-sm ring-1 ring-emerald-600/50'
                : 'text-emerald-200/90 hover:bg-emerald-800/50 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Loans & Credit</span>
          </button>

          <button
            id="nav-tab-infrastructure"
            onClick={() => onSelectTab('infrastructure')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              currentTab === 'infrastructure'
                ? 'bg-emerald-800/90 text-white shadow-sm ring-1 ring-emerald-600/50'
                : 'text-emerald-200/90 hover:bg-emerald-800/50 hover:text-white'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>Infrastructure Assets</span>
          </button>

          <button
            id="nav-tab-audit"
            onClick={() => onSelectTab('audit')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              currentTab === 'audit'
                ? 'bg-emerald-800/90 text-white shadow-sm ring-1 ring-emerald-600/50'
                : 'text-emerald-200/90 hover:bg-emerald-800/50 hover:text-white'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Audit Logs & Deploy</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
