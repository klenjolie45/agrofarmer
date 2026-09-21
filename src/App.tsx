import React, { useState, useEffect, useCallback } from 'react';
import { 
  Farmer, 
  Loan, 
  InfrastructureAsset, 
  AuditLog, 
  SystemSummary,
  Officer 
} from './types';
import { api } from './api';
import { Header, NavTab } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { FarmersView } from './components/FarmersView';
import { LoansView } from './components/LoansView';
import { InfrastructureView } from './components/InfrastructureView';
import { OfficersView } from './components/OfficersView';
import { AuditLogsView } from './components/AuditLogsView';
import { Homepage } from './components/Homepage';
import { FarmerPortal } from './components/FarmerPortal';
import { OfficerLogin } from './components/OfficerLogin';

// Modals
import { FarmerModal } from './components/FarmerModal';
import { FarmerDetailModal } from './components/FarmerDetailModal';
import { LoanModal } from './components/LoanModal';
import { LoanDetailModal } from './components/LoanDetailModal';
import { RepaymentModal } from './components/RepaymentModal';
import { InfrastructureModal } from './components/InfrastructureModal';
import { AssetDetailModal } from './components/AssetDetailModal';
import { MaintenanceModal } from './components/MaintenanceModal';
import { OfficerModal } from './components/OfficerModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'farmer-portal'>('home');
  const [portalFarmerPhone, setPortalFarmerPhone] = useState<string>('');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Officer Authentication State
  const [currentOfficer, setCurrentOfficer] = useState<Officer | null>(() => {
    try {
      const stored = localStorage.getItem('_officer');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Main Data States
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [infrastructure, setInfrastructure] = useState<InfrastructureAsset[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [summary, setSummary] = useState<SystemSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
  const [selectedFarmerForDetail, setSelectedFarmerForDetail] = useState<Farmer | null>(null);

  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [loanModalFarmerId, setLoanModalFarmerId] = useState<string | undefined>(undefined);
  const [selectedLoanForDetail, setSelectedLoanForDetail] = useState<Loan | null>(null);

  const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);
  const [selectedLoanForRepay, setSelectedLoanForRepay] = useState<Loan | null>(null);

  const [isInfrastructureModalOpen, setIsInfrastructureModalOpen] = useState(false);
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<InfrastructureAsset | null>(null);

  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedAssetForMaintenance, setSelectedAssetForMaintenance] = useState<InfrastructureAsset | null>(null);

  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load all system records
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [farmersData, loansData, infraData, summaryData, logsData, officersData] = await Promise.all([
        api.getFarmers(),
        api.getLoans(),
        api.getInfrastructure(),
        api.getSummary(),
        api.getAuditLogs(),
        api.getOfficers(),
      ]);

      setFarmers(farmersData);
      setLoans(loansData);
      setInfrastructure(infraData);
      setSummary(summaryData);
      setAuditLogs(logsData);
      setOfficers(officersData);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to connect to  API backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Farmer Handlers
  const handleSaveFarmer = async (farmerData: Partial<Farmer>) => {
    if (editingFarmer) {
      await api.updateFarmer(editingFarmer.id, farmerData);
      showToast(`Farmer ${farmerData.fullName} updated successfully.`);
    } else {
      const created = await api.createFarmer(farmerData);
      showToast(`Farmer ${created.fullName} registered with code ${created.farmerCode}.`);
    }
    await loadData();
  };

  const handleDeleteFarmer = async (id: string) => {
    await api.deleteFarmer(id);
    showToast('Farmer record removed.');
    await loadData();
  };

  const handleOpenEditFarmer = (farmer: Farmer) => {
    setEditingFarmer(farmer);
    setIsFarmerModalOpen(true);
  };

  const handleOpenNewFarmer = () => {
    setEditingFarmer(null);
    setIsFarmerModalOpen(true);
  };

  const handleOpenApplyLoanForFarmer = (farmer: Farmer) => {
    setSelectedFarmerForDetail(null);
    setLoanModalFarmerId(farmer.id);
    setIsLoanModalOpen(true);
  };

  // Loan Handlers
  const handleApplyLoan = async (loanData: any) => {
    const created = await api.applyForLoan(loanData);
    showToast(`Loan application ${created.loanCode} submitted for review.`);
    await loadData();
  };

  const handleApproveLoan = async (loan: Loan) => {
    await api.updateLoanStatus(loan.id, 'Approved', loan.amountRequested);
    showToast(`Loan ${loan.loanCode} approved for ₦${loan.amountRequested.toLocaleString()}.`);
    await loadData();
  };

  const handleApproveLoanFromDetail = async (loanId: string, approvedAmount: number) => {
    await api.updateLoanStatus(loanId, 'Approved', approvedAmount);
    showToast(`Loan approved for ₦${approvedAmount.toLocaleString()}.`);
    await loadData();
  };

  const handleRejectLoanFromDetail = async (loanId: string) => {
    await api.updateLoanStatus(loanId, 'Rejected');
    showToast(`Loan application rejected.`);
    await loadData();
  };

  const handleDisburseLoan = async (loan: Loan) => {
    await api.updateLoanStatus(loan.id, 'Disbursed');
    showToast(`Loan ${loan.loanCode} funds disbursed to borrower.`);
    await loadData();
  };

  const handleDisburseLoanFromDetail = async (loanId: string) => {
    await api.updateLoanStatus(loanId, 'Disbursed');
    showToast(`Loan funds disbursed to borrower.`);
    await loadData();
  };

  const handleRecordRepayment = async (loanId: string, repayData: any) => {
    const updatedLoan = await api.recordRepayment(loanId, repayData);
    showToast(`Repayment of ₦${Number(repayData.amount).toLocaleString()} recorded successfully.`);
    await loadData();
    // Update active modal if open
    if (selectedLoanForDetail && selectedLoanForDetail.id === loanId) {
      setSelectedLoanForDetail(updatedLoan);
    }
  };

  // Infrastructure Handlers
  const handleSaveAsset = async (assetData: Partial<InfrastructureAsset>) => {
    const created = await api.createInfrastructure(assetData);
    showToast(`Asset ${created.name} registered with code ${created.assetCode}.`);
    await loadData();
  };

  const handleDeleteAsset = async (id: string) => {
    await api.deleteInfrastructure(id);
    showToast('Infrastructure asset deleted.');
    await loadData();
  };

  const handleLogMaintenance = async (assetId: string, logData: any) => {
    await api.logMaintenance(assetId, logData);
    showToast('Maintenance service logged successfully.');
    await loadData();
  };

  // Officer & RBAC Handlers
  const handleSaveOfficer = async (officerData: Partial<Officer>) => {
    if (editingOfficer) {
      const updated = await api.updateOfficer(editingOfficer.id, {
        ...officerData,
        performedBy: currentOfficer?.fullName || 'Super Officer'
      });
      showToast(`Officer ${updated.fullName} updated successfully.`);
      if (currentOfficer?.id === updated.id) {
        setCurrentOfficer(updated);
        try {
          localStorage.setItem('_officer', JSON.stringify(updated));
        } catch (e) {}
      }
    } else {
      const created = await api.createOfficer({
        ...officerData,
        fullName: officerData.fullName || 'New Officer',
        email: officerData.email || '',
        role: officerData.role || 'FIELD_OFFICER',
        performedBy: currentOfficer?.fullName || 'Super Officer'
      });
      showToast(`Officer ${created.fullName} (${created.staffCode}) registered as ${created.role}.`);
    }
    setIsOfficerModalOpen(false);
    setEditingOfficer(null);
    await loadData();
  };

  const handleToggleOfficerStatus = async (officer: Officer) => {
    const nextStatus = officer.status === 'Active' ? 'Suspended' : 'Active';
    await api.updateOfficer(officer.id, {
      status: nextStatus,
      performedBy: currentOfficer?.fullName || 'Super Officer'
    });
    showToast(`Officer ${officer.fullName} is now ${nextStatus}.`);
    await loadData();
  };

  const handleDeleteOfficer = async (officerId: string) => {
    await api.deleteOfficer(officerId, currentOfficer?.fullName || 'Super Officer');
    showToast('Officer profile removed from directory.');
    await loadData();
  };

  const handleLogoutOfficer = () => {
    setCurrentOfficer(null);
    try {
      localStorage.removeItem('_officer');
    } catch (e) {}
    showToast('Logged out of Officer ERP.');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 flex flex-col font-sans">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 border border-emerald-500/40 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {currentView === 'home' ? (
        <Homepage
          stats={summary?.summary ?? null}
          onEnterFarmerPortal={() => {
            setPortalFarmerPhone('');
            setCurrentView('farmer-portal');
          }}
          onEnterAdmin={() => setCurrentView('admin')}
          onQuickLoginFarmer={(phone) => {
            setPortalFarmerPhone(phone);
            setCurrentView('farmer-portal');
          }}
        />
      ) : currentView === 'farmer-portal' ? (
        <FarmerPortal
          onReturnToHome={() => setCurrentView('home')}
          onSwitchToAdmin={() => setCurrentView('admin')}
          initialFarmerPhone={portalFarmerPhone}
        />
      ) : !currentOfficer ? (
        <OfficerLogin
          onLoginSuccess={(officer, _token) => {
            setCurrentOfficer(officer);
            try {
              localStorage.setItem('_officer', JSON.stringify(officer));
            } catch (e) {}
            showToast(`Welcome back, ${officer.fullName}! Logged in as ${officer.roleTitle}.`);
          }}
          onReturnHome={() => setCurrentView('home')}
        />
      ) : (
        <>
          {/* Persistent App Header */}
          <Header
            currentTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenNewFarmer={handleOpenNewFarmer}
            onOpenNewLoan={() => {
              setLoanModalFarmerId(undefined);
              setIsLoanModalOpen(true);
            }}
            onOpenNewAsset={() => setIsInfrastructureModalOpen(true)}
            onOpenNewOfficer={() => {
              setEditingOfficer(null);
              setIsOfficerModalOpen(true);
            }}
            onNavigateHome={() => setCurrentView('home')}
            onNavigateFarmerPortal={() => {
              setPortalFarmerPhone('');
              setCurrentView('farmer-portal');
            }}
            currentOfficer={currentOfficer}
            onLogoutOfficer={handleLogoutOfficer}
          />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {loading && farmers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-stone-500 space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-medium">Connecting to  Agricultural Database...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center max-w-lg mx-auto my-12">
            <h3 className="font-bold text-rose-900 text-sm">System Connection Error</h3>
            <p className="text-xs text-rose-700 mt-1">{error}</p>
            <button
              onClick={loadData}
              className="mt-4 px-4 py-1.5 bg-rose-700 text-white text-xs font-semibold rounded-lg hover:bg-rose-800 transition cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                analyticsData={summary}
                loans={loans}
                infrastructure={infrastructure}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenNewFarmer={handleOpenNewFarmer}
                onOpenNewLoan={() => {
                  setLoanModalFarmerId(undefined);
                  setIsLoanModalOpen(true);
                }}
                onSelectLoan={(l) => setSelectedLoanForDetail(l)}
                onSelectAsset={(a) => setSelectedAssetForDetail(a)}
              />
            )}

            {activeTab === 'farmers' && (
              <FarmersView
                farmers={farmers}
                loans={loans}
                currentOfficer={currentOfficer}
                onOpenNewFarmer={handleOpenNewFarmer}
                onSelectFarmer={(f) => setSelectedFarmerForDetail(f)}
                onEditFarmer={handleOpenEditFarmer}
                onDeleteFarmer={handleDeleteFarmer}
                onApplyLoanForFarmer={handleOpenApplyLoanForFarmer}
              />
            )}

            {activeTab === 'loans' && (
              <LoansView
                loans={loans}
                farmers={farmers}
                currentOfficer={currentOfficer}
                onOpenNewLoan={() => {
                  setLoanModalFarmerId(undefined);
                  setIsLoanModalOpen(true);
                }}
                onSelectLoan={(l) => setSelectedLoanForDetail(l)}
                onApproveLoan={handleApproveLoan}
                onDisburseLoan={handleDisburseLoan}
                onOpenRepayModal={(l) => {
                  setSelectedLoanForRepay(l);
                  setIsRepaymentModalOpen(true);
                }}
              />
            )}

            {activeTab === 'infrastructure' && (
              <InfrastructureView
                infrastructure={infrastructure}
                onOpenNewAsset={() => setIsInfrastructureModalOpen(true)}
                onSelectAsset={(a) => setSelectedAssetForDetail(a)}
                onLogMaintenance={(a) => {
                  setSelectedAssetForMaintenance(a);
                  setIsMaintenanceModalOpen(true);
                }}
                onDeleteAsset={handleDeleteAsset}
              />
            )}

            {activeTab === 'officers' && (
              <OfficersView
                officers={officers}
                currentOfficer={currentOfficer}
                onOpenCreateOfficer={() => {
                  setEditingOfficer(null);
                  setIsOfficerModalOpen(true);
                }}
                onEditOfficer={(officer) => {
                  setEditingOfficer(officer);
                  setIsOfficerModalOpen(true);
                }}
                onToggleStatus={handleToggleOfficerStatus}
                onDeleteOfficer={handleDeleteOfficer}
              />
            )}

            {activeTab === 'audit' && (
              <AuditLogsView logs={auditLogs} onRefresh={loadData} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-4 px-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span>AgroProduce Smallholder ERP & Microfinance Engine</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Render Deployment Ready</span>
          </div>
          <div className="text-[11px] text-stone-400">
            Database: Atomic JSON file persistence • Port 3000 • Production Node.js Server
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Farmer Registration & Edit Modal */}
      <FarmerModal
        isOpen={isFarmerModalOpen}
        onClose={() => setIsFarmerModalOpen(false)}
        onSave={handleSaveFarmer}
        initialFarmer={editingFarmer}
      />

      {/* 2. Farmer Detailed Dossier Modal */}
      <FarmerDetailModal
        isOpen={!!selectedFarmerForDetail}
        farmer={selectedFarmerForDetail}
        loans={loans}
        onClose={() => setSelectedFarmerForDetail(null)}
        onApplyLoan={handleOpenApplyLoanForFarmer}
        onSelectLoan={(loan) => {
          setSelectedFarmerForDetail(null);
          setSelectedLoanForDetail(loan);
        }}
      />

      {/* 3. Loan Application Modal */}
      <LoanModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        farmers={farmers}
        selectedFarmerId={loanModalFarmerId}
        onApply={handleApplyLoan}
      />

      {/* 4. Loan Detail & Underwriting Modal */}
      <LoanDetailModal
        isOpen={!!selectedLoanForDetail}
        loan={selectedLoanForDetail}
        onClose={() => setSelectedLoanForDetail(null)}
        onApprove={handleApproveLoanFromDetail}
        onReject={handleRejectLoanFromDetail}
        onDisburse={handleDisburseLoanFromDetail}
        onOpenRepay={(loan) => {
          setSelectedLoanForRepay(loan);
          setIsRepaymentModalOpen(true);
        }}
      />

      {/* 5. Repayment Recording Modal */}
      <RepaymentModal
        isOpen={isRepaymentModalOpen}
        loan={selectedLoanForRepay}
        onClose={() => setIsRepaymentModalOpen(false)}
        onRecord={handleRecordRepayment}
      />

      {/* 6. Infrastructure Registration Modal */}
      <InfrastructureModal
        isOpen={isInfrastructureModalOpen}
        onClose={() => setIsInfrastructureModalOpen(false)}
        onSave={handleSaveAsset}
      />

      {/* 7. Asset Detail Dossier Modal */}
      <AssetDetailModal
        isOpen={!!selectedAssetForDetail}
        asset={selectedAssetForDetail}
        onClose={() => setSelectedAssetForDetail(null)}
        onLogMaintenance={(asset) => {
          setSelectedAssetForMaintenance(asset);
          setIsMaintenanceModalOpen(true);
        }}
      />

      {/* 8. Asset Maintenance Logging Modal */}
      <MaintenanceModal
        isOpen={isMaintenanceModalOpen}
        asset={selectedAssetForMaintenance}
        onClose={() => setIsMaintenanceModalOpen(false)}
        onLog={handleLogMaintenance}
      />

      {/* 9. Officer Creation & RBAC Permissions Modal */}
      <OfficerModal
        isOpen={isOfficerModalOpen}
        onClose={() => {
          setIsOfficerModalOpen(false);
          setEditingOfficer(null);
        }}
        onSave={handleSaveOfficer}
        editingOfficer={editingOfficer}
        currentOfficer={currentOfficer}
      />
      </>
      )}
    </div>
  );
}
