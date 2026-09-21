import React, { useState, useMemo } from 'react';
import { Loan, Farmer } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  CreditCard,
  Percent,
  Calendar,
  Layers,
  ChevronRight,
  Calculator,
  Lock
} from 'lucide-react';
import { Officer } from '../types';

interface LoansViewProps {
  loans: Loan[];
  farmers: Farmer[];
  currentOfficer?: Officer | null;
  onOpenNewLoan: () => void;
  onSelectLoan: (loan: Loan) => void;
  onApproveLoan: (loan: Loan) => void;
  onDisburseLoan: (loan: Loan) => void;
  onOpenRepayModal: (loan: Loan) => void;
}

export const LoansView: React.FC<LoansViewProps> = ({
  loans,
  farmers,
  currentOfficer,
  onOpenNewLoan,
  onSelectLoan,
  onApproveLoan,
  onDisburseLoan,
  onOpenRepayModal,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const canApprove = !currentOfficer || currentOfficer.role === 'SUPER_OFFICER' || 
    (currentOfficer.permissions && currentOfficer.permissions.includes('approve_loans'));
  const canDisburse = !currentOfficer || currentOfficer.role === 'SUPER_OFFICER' || 
    (currentOfficer.permissions && currentOfficer.permissions.includes('disburse_loans'));
  const canRepay = !currentOfficer || currentOfficer.role === 'SUPER_OFFICER' || 
    (currentOfficer.permissions && currentOfficer.permissions.includes('record_repayments'));

  // Filtered loans
  const filteredLoans = useMemo(() => {
    return loans.filter(l => {
      const matchSearch =
        !search ||
        l.loanCode.toLowerCase().includes(search.toLowerCase()) ||
        l.farmerName.toLowerCase().includes(search.toLowerCase()) ||
        l.purpose.toLowerCase().includes(search.toLowerCase()) ||
        l.farmerPhone.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'all' || l.status.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [loans, search, statusFilter]);

  // Aggregate metrics
  const totalVolume = filteredLoans.reduce((sum, l) => sum + (l.amountApproved || l.amountRequested), 0);
  const totalRepaid = filteredLoans.reduce((sum, l) => sum + (l.totalRepaid || 0), 0);
  const totalOutstanding = filteredLoans.reduce((sum, l) => sum + (l.outstandingBalance || 0), 0);

  const pendingCount = loans.filter(l => l.status === 'Pending').length;
  const approvedCount = loans.filter(l => l.status === 'Approved').length;
  const repayingCount = loans.filter(l => l.status === 'Repaying' || l.status === 'Disbursed').length;
  const completedCount = loans.filter(l => l.status === 'Completed').length;

  return (
    <div className="space-y-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Agricultural Credit & Micro-Loan Portfolio</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
              {filteredLoans.length} Loans
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Financing smallholder seeds, solar irrigation, mechanization, and harvest working capital.
          </p>
        </div>

        <button
          id="btn-new-loan-app"
          onClick={onOpenNewLoan}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Loan Application</span>
        </button>
      </div>

      {/* Credit Pipeline Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          All Applications ({loans.length})
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'pending'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Pending Review</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('approved')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'approved'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Approved ({approvedCount})</span>
        </button>

        <button
          onClick={() => setStatusFilter('repaying')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
            statusFilter === 'repaying'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <span>Active Repaying ({repayingCount})</span>
        </button>

        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            statusFilter === 'completed'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          Fully Repaid ({completedCount})
        </button>
      </div>

      {/* Credit Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-500 uppercase">Total Portfolio Volume</div>
          <div className="text-xl font-bold text-stone-900 mt-0.5">₦{totalVolume.toLocaleString()}</div>
          <div className="text-[11px] text-stone-400 mt-1">Disbursed and approved agricultural credit</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-500 uppercase">Total Recovered Repayments</div>
          <div className="text-xl font-bold text-emerald-700 mt-0.5">₦{totalRepaid.toLocaleString()}</div>
          <div className="text-[11px] text-stone-400 mt-1">Direct bank & mobile money deposits</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-medium text-stone-500 uppercase">Outstanding Balance</div>
          <div className="text-xl font-bold text-amber-700 mt-0.5">₦{totalOutstanding.toLocaleString()}</div>
          <div className="text-[11px] text-stone-400 mt-1">Due according to installment schedules</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            id="input-search-loans"
            type="text"
            placeholder="Search loans by loan code (e.g. LN-2026), farmer name, purpose, or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Loans Table */}
      {filteredLoans.length > 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Loan Identification</th>
                  <th className="py-3 px-4">Borrower / Farmland</th>
                  <th className="py-3 px-4">Credit Terms</th>
                  <th className="py-3 px-4">Recovery Progress</th>
                  <th className="py-3 px-4">Status & Risk</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredLoans.map(loan => {
                  const percentRepaid = loan.outstandingBalance + loan.totalRepaid > 0
                    ? Math.round((loan.totalRepaid / (loan.outstandingBalance + loan.totalRepaid)) * 100)
                    : 0;

                  return (
                    <tr
                      key={loan.id}
                      className="hover:bg-stone-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectLoan(loan)}
                    >
                      {/* Code & Purpose */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-stone-900 text-sm">{loan.loanCode}</div>
                        <div className="text-[11px] font-medium text-emerald-800 mt-0.5">
                          {loan.purpose}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Applied: {loan.applicationDate}
                        </div>
                      </td>

                      {/* Borrower */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{loan.farmerName}</div>
                        <div className="text-[11px] text-stone-500">{loan.farmerPhone}</div>
                        <div className="text-[10px] text-stone-400">{loan.farmSizeHectares} hectares farm</div>
                      </td>

                      {/* Credit Terms */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900 text-sm">
                          ₦{(loan.amountApproved || loan.amountRequested).toLocaleString()}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {loan.interestRate}% APR • {loan.durationMonths} Months
                        </div>
                        <div className="text-[10px] text-stone-400 capitalize">
                          Frequency: {loan.repaymentFrequency}
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="py-3.5 px-4 min-w-[180px]">
                        <div className="flex justify-between text-[11px] font-semibold mb-1">
                          <span className="text-emerald-700">₦{loan.totalRepaid.toLocaleString()}</span>
                          <span className="text-stone-500">Bal: ₦{loan.outstandingBalance.toLocaleString()}</span>
                        </div>
                        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              percentRepaid === 100 ? 'bg-emerald-600' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${percentRepaid}%` }}
                          ></div>
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5 text-right">
                          {percentRepaid}% Repaid
                        </div>
                      </td>

                      {/* Status & Risk */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            loan.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : loan.status === 'Repaying' || loan.status === 'Disbursed'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : loan.status === 'Approved'
                              ? 'bg-blue-100 text-blue-800'
                              : loan.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {loan.status}
                          </span>

                          <div>
                            <span className={`text-[10px] font-semibold ${
                              loan.riskAssessment === 'Low Risk'
                                ? 'text-emerald-700'
                                : loan.riskAssessment === 'Moderate Risk'
                                ? 'text-amber-700'
                                : 'text-rose-700'
                            }`}>
                              {loan.riskAssessment}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {loan.status === 'Pending' && canApprove && (
                            <button
                              onClick={() => onApproveLoan(loan)}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-700 hover:bg-emerald-800 text-white transition cursor-pointer shadow-xs"
                            >
                              Approve
                            </button>
                          )}

                          {loan.status === 'Approved' && canDisburse && (
                            <button
                              onClick={() => onDisburseLoan(loan)}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer shadow-xs"
                            >
                              Disburse
                            </button>
                          )}

                          {(loan.status === 'Repaying' || loan.status === 'Disbursed') && canRepay && (
                            <button
                              onClick={() => onOpenRepayModal(loan)}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-800 hover:bg-emerald-700 text-white transition cursor-pointer shadow-xs flex items-center gap-1"
                            >
                              <CreditCard className="w-3 h-3 text-emerald-300" />
                              <span>Repay</span>
                            </button>
                          )}

                          <button
                            onClick={() => onSelectLoan(loan)}
                            className="px-2 py-1 text-xs font-medium rounded border border-stone-200 text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                          >
                            Details
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
          <CreditCard className="w-12 h-12 text-emerald-600 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-stone-900">No Loans Found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            No credit records match your selected criteria. Try choosing a different status filter or clear the search.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
            }}
            className="mt-4 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
};
