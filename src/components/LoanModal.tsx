import React, { useState, useEffect, useMemo } from 'react';
import { Farmer, Loan } from '../types';
import { X, DollarSign, Calculator, UserCheck, ShieldCheck, FileText } from 'lucide-react';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmers: Farmer[];
  selectedFarmerId?: string;
  onApply: (loanData: {
    farmerId: string;
    purpose: any;
    amountRequested: number;
    interestRate: number;
    durationMonths: number;
    repaymentFrequency: any;
    collateralDescription: string;
    guarantorName: string;
    guarantorPhone: string;
    notes?: string;
  }) => Promise<void>;
}

export const LoanModal: React.FC<LoanModalProps> = ({
  isOpen,
  onClose,
  farmers,
  selectedFarmerId,
  onApply,
}) => {
  const [farmerId, setFarmerId] = useState(selectedFarmerId || '');
  const [purpose, setPurpose] = useState<Loan['purpose']>('Seed & Fertilizer');
  const [amountRequested, setAmountRequested] = useState<number>(3000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [durationMonths, setDurationMonths] = useState<number>(6);
  const [repaymentFrequency, setRepaymentFrequency] = useState<Loan['repaymentFrequency']>('Monthly');
  const [collateralDescription, setCollateralDescription] = useState('Warehouse receipt / Post-harvest crop lien');
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedFarmerId) {
      setFarmerId(selectedFarmerId);
      const f = farmers.find(farm => farm.id === selectedFarmerId);
      if (f && f.cooperativeName) {
        setGuarantorName(`${f.cooperativeName} Group Guarantee`);
      }
    } else if (farmers.length > 0 && !farmerId) {
      setFarmerId(farmers[0].id);
      if (farmers[0].cooperativeName) {
        setGuarantorName(`${farmers[0].cooperativeName} Group Guarantee`);
      }
    }
  }, [selectedFarmerId, farmers, isOpen]);

  const selectedFarmer = useMemo(() => {
    return farmers.find(f => f.id === farmerId);
  }, [farmers, farmerId]);

  // Financial calculations
  const totalInterest = useMemo(() => {
    return (amountRequested * (interestRate / 100) * (durationMonths / 12));
  }, [amountRequested, interestRate, durationMonths]);

  const totalRepayment = useMemo(() => {
    return amountRequested + totalInterest;
  }, [amountRequested, totalInterest]);

  const installmentCount = useMemo(() => {
    if (repaymentFrequency === 'Monthly') return durationMonths;
    if (repaymentFrequency === 'Quarterly') return Math.max(1, Math.floor(durationMonths / 3));
    return 2; // Seasonal harvest
  }, [repaymentFrequency, durationMonths]);

  const perInstallmentAmount = useMemo(() => {
    return installmentCount > 0 ? (totalRepayment / installmentCount) : totalRepayment;
  }, [totalRepayment, installmentCount]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerId) {
      alert('Please select a registered farmer.');
      return;
    }
    if (amountRequested <= 0) {
      alert('Amount requested must be greater than $0.');
      return;
    }

    try {
      setSubmitting(true);
      await onApply({
        farmerId,
        purpose,
        amountRequested,
        interestRate,
        durationMonths,
        repaymentFrequency,
        collateralDescription,
        guarantorName,
        guarantorPhone,
        notes,
      });
      onClose();
    } catch (err: any) {
      alert('Failed to submit loan: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <DollarSign className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-base">New Agricultural Loan Application</h3>
              <p className="text-xs text-emerald-200">
                Originate working capital, inputs, or equipment credit for registered farmers.
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Farmer Selection */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Select Farmer / Borrower *</label>
            <select
              value={farmerId}
              onChange={e => {
                setFarmerId(e.target.value);
                const farm = farmers.find(f => f.id === e.target.value);
                if (farm && farm.cooperativeName) {
                  setGuarantorName(`${farm.cooperativeName} Group Guarantee`);
                }
              }}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-medium"
            >
              {farmers.map(f => (
                <option key={f.id} value={f.id}>
                  {f.fullName} ({f.farmerCode}) • {f.region} • {f.farmSizeHectares} ha
                </option>
              ))}
            </select>
          </div>

          {selectedFarmer && (
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-900">{selectedFarmer.fullName}</span>
                <div className="text-[11px] text-emerald-700">
                  {selectedFarmer.phone} • {selectedFarmer.cooperativeName} • KYC: {selectedFarmer.kycStatus}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900">
                Score: {selectedFarmer.creditRating}
              </span>
            </div>
          )}

          {/* Purpose & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Financing Purpose *</label>
              <select
                value={purpose}
                onChange={e => setPurpose(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-medium"
              >
                <option value="Seed & Fertilizer">Seed & Fertilizer (Input Credit)</option>
                <option value="Irrigation Equipment">Irrigation Equipment & Piping</option>
                <option value="Solar Water Pump">Solar Water Pump Installation</option>
                <option value="Tractor & Machinery">Tractor & Heavy Machinery Financing</option>
                <option value="Post-Harvest Storage">Post-Harvest Storage & Silo Bags</option>
                <option value="Livestock Feed & Care">Livestock Feed & Veterinary Care</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Amount Requested ($ USD) *</label>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={amountRequested}
                onChange={e => setAmountRequested(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold text-sm text-stone-900"
              />
            </div>
          </div>

          {/* Term, APR, Repayment Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Duration (Months)</label>
              <select
                value={durationMonths}
                onChange={e => setDurationMonths(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
              >
                <option value="3">3 Months (Short Season)</option>
                <option value="6">6 Months (Standard Crop Cycle)</option>
                <option value="9">9 Months</option>
                <option value="12">12 Months (Annual)</option>
                <option value="18">18 Months (Mechanization)</option>
                <option value="24">24 Months (Capital Investment)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Interest Rate (% APR)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                value={interestRate}
                onChange={e => setInterestRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Repayment Cadence</label>
              <select
                value={repaymentFrequency}
                onChange={e => setRepaymentFrequency(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
              >
                <option value="Monthly">Monthly Installments</option>
                <option value="Seasonal Harvest">Seasonal at Harvest</option>
                <option value="Quarterly">Quarterly Installments</option>
              </select>
            </div>
          </div>

          {/* Real-time Calculation Box */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-stone-800 uppercase text-[10px] tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-emerald-700" />
              <span>Projected Repayment Schedule</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-white p-2 rounded-lg border border-stone-200">
                <span className="text-stone-400 block text-[10px]">Total Interest</span>
                <span className="font-bold text-stone-800">${totalInterest.toFixed(2)}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-stone-200">
                <span className="text-stone-400 block text-[10px]">Total Repayable</span>
                <span className="font-bold text-emerald-800">${totalRepayment.toFixed(2)}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-stone-200">
                <span className="text-stone-400 block text-[10px]">Per Installment ({installmentCount}x)</span>
                <span className="font-bold text-stone-900">${perInstallmentAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Collateral & Guarantor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Collateral / Security Pledged</label>
              <input
                type="text"
                value={collateralDescription}
                onChange={e => setCollateralDescription(e.target.value)}
                placeholder="e.g. Grain Warehouse Receipt #401"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Guarantor / Group Guarantee</label>
              <input
                type="text"
                value={guarantorName}
                onChange={e => setGuarantorName(e.target.value)}
                placeholder="e.g. Umunna Cooperative Group"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Application / Underwriting Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Credit committee or field officer observations..."
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
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
              {submitting ? 'Submitting Application...' : 'Submit Loan Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
