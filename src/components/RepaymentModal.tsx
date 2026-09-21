import React, { useState } from 'react';
import { Loan } from '../types';
import { X, CreditCard, DollarSign, CheckCircle2 } from 'lucide-react';

interface RepaymentModalProps {
  loan: Loan | null;
  isOpen: boolean;
  onClose: () => void;
  onRecord: (loanId: string, data: {
    amount: number;
    paymentMethod: any;
    referenceNo: string;
    recordedBy: string;
    notes?: string;
  }) => Promise<void>;
}

export const RepaymentModal: React.FC<RepaymentModalProps> = ({
  loan,
  isOpen,
  onClose,
  onRecord,
}) => {
  if (!isOpen || !loan) return null;

  const nextInstallment = loan.installments.find(i => i.status === 'Pending' || (i.amountPaid < i.amountDue));
  const defaultAmount = nextInstallment ? (nextInstallment.amountDue - nextInstallment.amountPaid) : loan.outstandingBalance;

  const [amount, setAmount] = useState<number>(Math.min(defaultAmount, loan.outstandingBalance));
  const [paymentMethod, setPaymentMethod] = useState<any>('Mobile Money (M-Pesa)');
  const [referenceNo, setReferenceNo] = useState(`TX-${Date.now().toString().slice(-6)}`);
  const [recordedBy, setRecordedBy] = useState('Loan Officer');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Repayment amount must be greater than ₦0.');
      return;
    }
    if (amount > loan.outstandingBalance) {
      if (!window.confirm(`Amount (₦${amount.toLocaleString()}) exceeds current outstanding balance (₦${loan.outstandingBalance.toLocaleString()}). Proceed?`)) {
        return;
      }
    }

    try {
      setSubmitting(true);
      await onRecord(loan.id, {
        amount,
        paymentMethod,
        referenceNo,
        recordedBy,
        notes,
      });
      onClose();
    } catch (err: any) {
      alert('Error recording repayment: ' + err.message);
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
            <CreditCard className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-base">Record Loan Repayment</h3>
              <p className="text-xs text-emerald-200">
                {loan.farmerName} • <span className="font-mono">{loan.loanCode}</span>
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

        {/* Balance Card */}
        <div className="bg-stone-50 px-6 py-3 border-b border-stone-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-stone-500 block text-[10px] uppercase font-semibold">Remaining Debt Balance</span>
            <span className="text-base font-bold text-amber-700">₦{loan.outstandingBalance.toLocaleString()}</span>
          </div>
          <div className="text-right">
            <span className="text-stone-500 block text-[10px] uppercase font-semibold">Total Paid So Far</span>
            <span className="text-sm font-bold text-emerald-700">₦{loan.totalRepaid.toLocaleString()}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-stone-700">Repayment Amount (₦ Naira) *</label>
              <div className="flex gap-1.5">
                {nextInstallment && (
                  <button
                    type="button"
                    onClick={() => setAmount(Number((nextInstallment.amountDue - nextInstallment.amountPaid).toFixed(0)))}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 hover:bg-stone-300 cursor-pointer"
                  >
                    Installment (₦{(nextInstallment.amountDue - nextInstallment.amountPaid).toLocaleString()})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setAmount(loan.outstandingBalance)}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-semibold cursor-pointer"
                >
                  Full Payoff
                </button>
              </div>
            </div>
            <input
              type="number"
              step="100"
              min="100"
              required
              value={amount}
              onChange={e => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-base font-bold text-stone-900 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-medium"
            >
              <option value="Bank Transfer">Direct Bank Transfer (NIBSS Instant / Interswitch)</option>
              <option value="OPay / PalmPay">OPay / PalmPay / Moniepoint</option>
              <option value="USSD">Bank USSD Transfer</option>
              <option value="Cash / POS Agent">Field Agent POS / Cash Voucher</option>
              <option value="Harvest Deduction">Cooperative Harvest Offtake Deduction</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Transaction Ref #</label>
              <input
                type="text"
                required
                value={referenceNo}
                onChange={e => setReferenceNo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Recorded By</label>
              <input
                type="text"
                required
                value={recordedBy}
                onChange={e => setRecordedBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Payment Notes / Receipt</label>
            <input
              type="text"
              placeholder="e.g. Grain off-take receipt voucher attached"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
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
              {submitting ? 'Recording...' : 'Confirm Repayment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
