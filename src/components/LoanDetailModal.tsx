import React, { useState } from 'react';
import { Loan } from '../types';
import { 
  X, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  FileText, 
  AlertCircle, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface LoanDetailModalProps {
  loan: Loan | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (loanId: string, approvedAmount: number) => Promise<void>;
  onReject: (loanId: string) => Promise<void>;
  onDisburse: (loanId: string) => Promise<void>;
  onOpenRepay: (loan: Loan) => void;
}

export const LoanDetailModal: React.FC<LoanDetailModalProps> = ({
  loan,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onDisburse,
  onOpenRepay,
}) => {
  const [approvedAmount, setApprovedAmount] = useState<number>(loan?.amountRequested || 0);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !loan) return null;

  const percentRepaid = loan.outstandingBalance + loan.totalRepaid > 0
    ? Math.round((loan.totalRepaid / (loan.outstandingBalance + loan.totalRepaid)) * 100)
    : 0;

  const handleApprove = async () => {
    try {
      setLoading(true);
      await onApprove(loan.id, approvedAmount || loan.amountRequested);
      onClose();
    } catch (err: any) {
      alert('Error approving loan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisburse = async () => {
    try {
      setLoading(true);
      await onDisburse(loan.id);
      onClose();
    } catch (err: any) {
      alert('Error disbursing loan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm(`Are you sure you want to reject loan ${loan.loanCode}?`)) return;
    try {
      setLoading(true);
      await onReject(loan.id);
      onClose();
    } catch (err: any) {
      alert('Error rejecting loan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{loan.purpose}</h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                {loan.loanCode}
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              Borrower: <strong>{loan.farmerName}</strong> ({loan.farmerPhone})
            </p>
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
          {/* Status & Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Principal Amount</span>
              <div className="text-base font-bold text-stone-900 mt-0.5">
                ${(loan.amountApproved || loan.amountRequested).toLocaleString()}
              </div>
              <span className="text-[10px] text-stone-400">{loan.interestRate}% APR • {loan.durationMonths}m</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Total Repaid</span>
              <div className="text-base font-bold text-emerald-700 mt-0.5">${loan.totalRepaid.toLocaleString()}</div>
              <span className="text-[10px] text-stone-400">{percentRepaid}% Settled</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Outstanding Balance</span>
              <div className="text-base font-bold text-amber-700 mt-0.5">${loan.outstandingBalance.toLocaleString()}</div>
              <span className="text-[10px] text-stone-400">Due: {loan.dueDate}</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Status & Risk</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {loan.status}
                </span>
                <span className="text-[10px] text-stone-500 font-semibold">{loan.riskAssessment}</span>
              </div>
            </div>
          </div>

          {/* Underwriting Workflow Banner (for Pending / Approved states) */}
          {loan.status === 'Pending' && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-amber-900 block text-sm">Credit Committee Decision Needed</span>
                <p className="text-xs text-amber-700 mt-0.5">
                  Requested: ${loan.amountRequested.toLocaleString()}. Confirm or adjust approved capital.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-stone-600 font-semibold text-[11px]">$</span>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={approvedAmount || loan.amountRequested}
                    onChange={e => setApprovedAmount(parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 text-xs rounded border border-amber-300 bg-white font-bold text-stone-900"
                  />
                </div>
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold cursor-pointer transition shadow-xs"
                >
                  Approve Loan
                </button>
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer transition shadow-xs"
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          {loan.status === 'Approved' && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-blue-900 block text-sm">Approved • Ready for Disbursement</span>
                <p className="text-xs text-blue-700 mt-0.5">
                  Approved amount of ${(loan.amountApproved || loan.amountRequested).toLocaleString()} is cleared for release.
                </p>
              </div>
              <button
                onClick={handleDisburse}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold cursor-pointer transition shadow-xs"
              >
                Disburse Funds Now
              </button>
            </div>
          )}

          {/* Underwriting & Collateral Details */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold block">Pledged Collateral</span>
              <p className="text-stone-800 font-medium mt-0.5">{loan.collateralDescription || 'None documented'}</p>
            </div>

            <div>
              <span className="text-stone-400 text-[10px] uppercase font-bold block">Guarantor Guarantee</span>
              <p className="text-stone-800 font-medium mt-0.5">
                {loan.guarantorName} {loan.guarantorPhone ? `(${loan.guarantorPhone})` : ''}
              </p>
            </div>

            {loan.notes && (
              <div className="sm:col-span-2 pt-2 border-t border-stone-200">
                <span className="text-stone-400 text-[10px] uppercase font-bold block">Officer Notes</span>
                <p className="text-stone-600 italic mt-0.5">{loan.notes}</p>
              </div>
            )}
          </div>

          {/* Installments Schedule Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">Installment Schedule</h4>
              {(loan.status === 'Repaying' || loan.status === 'Disbursed') && (
                <button
                  onClick={() => onOpenRepay(loan)}
                  className="px-3 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Record Repayment</span>
                </button>
              )}
            </div>

            {loan.installments.length > 0 ? (
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Due Date</th>
                      <th className="py-2.5 px-3">Amount Due</th>
                      <th className="py-2.5 px-3">Amount Paid</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Settled On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loan.installments.map(inst => (
                      <tr key={inst.installmentNumber} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 font-semibold text-stone-800">{inst.installmentNumber}</td>
                        <td className="py-2.5 px-3 text-stone-600">{inst.dueDate}</td>
                        <td className="py-2.5 px-3 font-bold text-stone-900">${inst.amountDue.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-semibold">${inst.amountPaid.toFixed(2)}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inst.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}>
                            {inst.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-stone-400">{inst.paidAt || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-stone-200 text-center text-stone-500">
                Installment schedule is generated automatically upon credit approval.
              </div>
            )}
          </div>

          {/* Repayment History Transactions Log */}
          {loan.repayments.length > 0 && (
            <div>
              <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-2">Recorded Repayment Receipts</h4>
              <div className="space-y-2">
                {loan.repayments.map(r => (
                  <div key={r.id} className="p-3 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-900">${r.amount.toLocaleString()}</div>
                      <div className="text-[11px] text-stone-500">
                        {r.paymentDate} via {r.paymentMethod} • Ref: <span className="font-mono">{r.referenceNo}</span>
                      </div>
                      {r.notes && <div className="text-[10px] text-stone-400 italic mt-0.5">{r.notes}</div>}
                    </div>
                    <span className="text-[10px] text-stone-400">By: {r.recordedBy}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 flex items-center justify-between">
          <span className="text-stone-500">Application Date: {loan.applicationDate}</span>
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
