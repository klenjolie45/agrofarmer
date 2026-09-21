import React from 'react';
import { Farmer, Loan } from '../types';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Sprout, 
  Building, 
  CreditCard,
  Printer
} from 'lucide-react';

interface FarmerDetailModalProps {
  farmer: Farmer | null;
  loans: Loan[];
  isOpen: boolean;
  onClose: () => void;
  onApplyLoan: (farmer: Farmer) => void;
  onSelectLoan: (loan: Loan) => void;
}

export const FarmerDetailModal: React.FC<FarmerDetailModalProps> = ({
  farmer,
  loans,
  isOpen,
  onClose,
  onApplyLoan,
  onSelectLoan,
}) => {
  if (!isOpen || !farmer) return null;

  const farmerLoans = loans.filter(l => l.farmerId === farmer.id);
  const totalBorrowed = farmerLoans.reduce((sum, l) => sum + (l.amountApproved || l.amountRequested), 0);
  const totalRepaid = farmerLoans.reduce((sum, l) => sum + (l.totalRepaid || 0), 0);
  const currentOutstanding = farmerLoans.reduce((sum, l) => sum + (l.outstandingBalance || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center font-bold text-base text-emerald-200">
              {farmer.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{farmer.fullName}</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                  {farmer.farmerCode}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-emerald-200 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {farmer.village}, {farmer.district}, {farmer.region}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {farmer.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="Print Farmer Profile"
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Cultivated Land</span>
              <div className="text-base font-bold text-stone-900 mt-0.5">{farmer.farmSizeHectares} ha</div>
              <span className="text-[10px] text-stone-400 capitalize">{farmer.ownershipStatus} land</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">KYC Status</span>
              <div className="flex items-center gap-1 text-sm font-bold text-stone-900 mt-0.5">
                {farmer.kycStatus === 'Verified' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>{farmer.kycStatus}</span>
              </div>
              <span className="text-[10px] text-stone-400">ID: {farmer.nationalId}</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Credit Score</span>
              <div className="text-base font-bold text-emerald-700 mt-0.5">Tier {farmer.creditRating}</div>
              <span className="text-[10px] text-stone-400">{farmerLoans.length} total loans</span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Active Balance</span>
              <div className="text-base font-bold text-amber-700 mt-0.5">${currentOutstanding.toLocaleString()}</div>
              <span className="text-[10px] text-stone-400">${totalRepaid.toLocaleString()} repaid</span>
            </div>
          </div>

          {/* Farm & Agricultural Specifications */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <h4 className="font-bold text-stone-900 mb-3 uppercase tracking-wider text-[11px]">Agricultural Specifications</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-stone-400 text-[10px] block uppercase font-semibold">Soil Composition</span>
                <span className="font-semibold text-stone-800">{farmer.soilType} Soil</span>
              </div>

              <div>
                <span className="text-stone-400 text-[10px] block uppercase font-semibold">Irrigation System</span>
                <span className="font-semibold text-stone-800">{farmer.irrigationType}</span>
              </div>

              <div>
                <span className="text-stone-400 text-[10px] block uppercase font-semibold">Cooperative Union</span>
                <span className="font-semibold text-stone-800 truncate block" title={farmer.cooperativeName}>
                  {farmer.cooperativeName}
                </span>
              </div>

              <div>
                <span className="text-stone-400 text-[10px] block uppercase font-semibold">Financial Provider</span>
                <span className="font-semibold text-stone-800">
                  {farmer.bankName || 'Not Assigned'}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-stone-200">
              <span className="text-stone-400 text-[10px] block uppercase font-semibold mb-1">Primary Crops & Products</span>
              <div className="flex flex-wrap gap-1.5">
                {farmer.primaryCrops.map(crop => (
                  <span key={crop} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            {farmer.notes && (
              <div className="mt-3 pt-3 border-t border-stone-200">
                <span className="text-stone-400 text-[10px] block uppercase font-semibold mb-0.5">Agronomist Field Notes</span>
                <p className="text-stone-600 text-xs italic">{farmer.notes}</p>
              </div>
            )}
          </div>

          {/* Credit & Loan History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">Associated Loans & Credit History</h4>
              <button
                onClick={() => onApplyLoan(farmer)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Apply for New Loan</span>
              </button>
            </div>

            {farmerLoans.length > 0 ? (
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3">Loan Code</th>
                      <th className="py-2.5 px-3">Purpose</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Repaid</th>
                      <th className="py-2.5 px-3">Balance</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {farmerLoans.map(l => (
                      <tr 
                        key={l.id} 
                        className="hover:bg-stone-50 cursor-pointer"
                        onClick={() => onSelectLoan(l)}
                      >
                        <td className="py-2.5 px-3 font-mono font-semibold text-stone-900">{l.loanCode}</td>
                        <td className="py-2.5 px-3 text-stone-700">{l.purpose}</td>
                        <td className="py-2.5 px-3 font-bold text-stone-900">
                          ${(l.amountApproved || l.amountRequested).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-emerald-700 font-medium">${l.totalRepaid.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-amber-700 font-medium">${l.outstandingBalance.toLocaleString()}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : l.status === 'Repaying' || l.status === 'Disbursed'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : l.status === 'Approved'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-stone-200 text-center text-stone-500">
                No credit applications logged for this farmer yet.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">Registered: {new Date(farmer.registeredAt).toLocaleDateString()}</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-100 cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => onApplyLoan(farmer)}
              className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition cursor-pointer"
            >
              Apply for Loan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
