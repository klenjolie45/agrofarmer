import React, { useState, useEffect } from 'react';
import { Farmer } from '../types';
import { X, UserCheck, Sprout, MapPin, Building, ShieldCheck } from 'lucide-react';

interface FarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (farmerData: Partial<Farmer>) => Promise<void>;
  initialFarmer?: Farmer | null;
}

export const FarmerModal: React.FC<FarmerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialFarmer,
}) => {
  const [formData, setFormData] = useState<Partial<Farmer>>({
    fullName: '',
    nationalId: '',
    phone: '',
    email: '',
    gender: 'Male',
    dob: '1988-01-01',
    region: 'Eastern Highlands',
    district: '',
    village: '',
    farmSizeHectares: 2.5,
    ownershipStatus: 'Owned',
    primaryCrops: ['Maize'],
    secondaryCrops: [],
    livestockTypes: [],
    soilType: 'Loamy',
    irrigationType: 'Rainfed',
    cooperativeName: '',
    bankName: '',
    accountNumber: '',
    kycStatus: 'Pending',
    status: 'Active',
    creditRating: 'B',
    notes: '',
  });

  const [saving, setSaving] = useState(false);
  const [primaryCropInput, setPrimaryCropInput] = useState('');
  const [activeTab, setActiveTab] = useState<'personal' | 'farm' | 'finance'>('personal');

  useEffect(() => {
    if (initialFarmer) {
      setFormData(initialFarmer);
    } else {
      setFormData({
        fullName: '',
        nationalId: '',
        phone: '',
        email: '',
        gender: 'Male',
        dob: '1988-01-01',
        region: 'Eastern Highlands',
        district: 'Agro Valley',
        village: 'Green Village',
        farmSizeHectares: 3.0,
        ownershipStatus: 'Owned',
        primaryCrops: ['Maize', 'Soybeans'],
        secondaryCrops: ['Vegetables'],
        livestockTypes: [],
        soilType: 'Loamy',
        irrigationType: 'Rainfed',
        cooperativeName: 'Local Grain Producers Coop',
        bankName: 'Agricultural Bank',
        accountNumber: '',
        kycStatus: 'Pending',
        status: 'Active',
        creditRating: 'B',
        notes: '',
      });
    }
  }, [initialFarmer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.nationalId) {
      alert('Full Name, National ID, and Phone Number are mandatory fields.');
      return;
    }

    try {
      setSaving(true);
      await onSave(formData);
      onClose();
    } catch (err: any) {
      alert('Error saving farmer: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const addCrop = () => {
    if (primaryCropInput.trim() && !formData.primaryCrops?.includes(primaryCropInput.trim())) {
      setFormData(prev => ({
        ...prev,
        primaryCrops: [...(prev.primaryCrops || []), primaryCropInput.trim()]
      }));
      setPrimaryCropInput('');
    }
  };

  const removeCrop = (cropToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      primaryCrops: prev.primaryCrops?.filter(c => c !== cropToRemove) || []
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-base">
                {initialFarmer ? 'Edit Farmer Profile' : 'Farmer Registration'}
              </h3>
              <p className="text-xs text-emerald-200">
                Register smallholder farmers, farm dimensions, and cooperative membership.
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

        {/* Step Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'personal'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            1. Personal & KYC
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('farm')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'farm'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            2. Land & Crops
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('finance')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'finance'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            3. Financial & Coop
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe / Amara Okafor"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">National ID / NIN *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NIN-83920194"
                    value={formData.nationalId}
                    onChange={e => setFormData({ ...formData, nationalId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Primary Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 000 0000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="farmer@email.com (optional)"
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">KYC Verification</label>
                  <select
                    value={formData.kycStatus}
                    onChange={e => setFormData({ ...formData, kycStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'farm' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Region</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Village / Sector</label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={e => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Farm Size (Hectares) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formData.farmSizeHectares}
                    onChange={e => setFormData({ ...formData, farmSizeHectares: parseFloat(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Land Ownership</label>
                  <select
                    value={formData.ownershipStatus}
                    onChange={e => setFormData({ ...formData, ownershipStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="Owned">Owned (Title Deed)</option>
                    <option value="Leased">Leased / Rented</option>
                    <option value="Communal">Communal Land</option>
                    <option value="Cooperative">Cooperative Allocated</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Soil Type</label>
                  <select
                    value={formData.soilType}
                    onChange={e => setFormData({ ...formData, soilType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="Loamy">Loamy (Fertile)</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Clay">Clay</option>
                    <option value="Silt">Silt</option>
                    <option value="Volcanic">Volcanic Rich</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Irrigation System</label>
                <select
                  value={formData.irrigationType}
                  onChange={e => setFormData({ ...formData, irrigationType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                >
                  <option value="Rainfed">Rainfed</option>
                  <option value="Solar Borehole">Solar Borehole</option>
                  <option value="Canal Gravity">Canal Gravity</option>
                  <option value="Drip System">Drip Irrigation System</option>
                  <option value="Sprinkler">Sprinkler System</option>
                </select>
              </div>

              {/* Crops Tag Input */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Primary Crops Grown</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add crop (e.g. Maize, Rice, Cassava, Coffee)"
                    value={primaryCropInput}
                    onChange={e => setPrimaryCropInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCrop();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCrop}
                    className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold cursor-pointer"
                  >
                    Add Crop
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-stone-50 rounded-lg border border-stone-100">
                  {formData.primaryCrops?.map(crop => (
                    <span
                      key={crop}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                    >
                      <span>{crop}</span>
                      <button
                        type="button"
                        onClick={() => removeCrop(crop)}
                        className="hover:text-rose-600 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {formData.primaryCrops?.length === 0 && (
                    <span className="text-stone-400 text-xs italic">No crops added yet.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Farmer Cooperative / Union</label>
                  <input
                    type="text"
                    placeholder="e.g. Volta Basin Rice Growers"
                    value={formData.cooperativeName}
                    onChange={e => setFormData({ ...formData, cooperativeName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Bank or Mobile Money Provider</label>
                  <input
                    type="text"
                    placeholder="e.g. Agricultural Bank / M-Pesa"
                    value={formData.bankName}
                    onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Bank Account / Wallet Number</label>
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={formData.accountNumber}
                    onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Initial Credit Score Rating</label>
                  <select
                    value={formData.creditRating}
                    onChange={e => setFormData({ ...formData, creditRating: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="A+">A+ (Tier 1 Prime Farmer)</option>
                    <option value="A">A (Excellent Credit Track Record)</option>
                    <option value="B">B (Standard Low Risk)</option>
                    <option value="C">C (High Monitoring Required)</option>
                    <option value="Unrated">Unrated (New Member)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Agronomist Field Notes</label>
                <textarea
                  rows={3}
                  placeholder="Special observations on harvest capability, soil yield history, or family labor capacity..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <div className="flex gap-2">
              {activeTab !== 'personal' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'finance' ? 'farm' : 'personal')}
                  className="px-3 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold cursor-pointer"
                >
                  Previous
                </button>
              )}
              {activeTab !== 'finance' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'personal' ? 'farm' : 'finance')}
                  className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold cursor-pointer"
                >
                  Next Step →
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : initialFarmer ? 'Update Profile' : 'Complete Registration'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
