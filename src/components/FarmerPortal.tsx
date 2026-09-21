import React, { useState, useEffect } from 'react';
import { 
  Farmer, 
  Loan, 
  FarmerAsset 
} from '../types';
import { api } from '../api';
import { 
  Sprout, 
  User, 
  Smartphone, 
  KeyRound, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Tractor, 
  FileText, 
  LogOut, 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Trash2, 
  Info,
  MapPin,
  Building,
  ArrowLeft,
  X,
  Upload
} from 'lucide-react';

interface FarmerPortalProps {
  onReturnToHome: () => void;
  onSwitchToAdmin: () => void;
  initialFarmerPhone?: string;
}

export const FarmerPortal: React.FC<FarmerPortalProps> = ({
  onReturnToHome,
  onSwitchToAdmin,
  initialFarmerPhone
}) => {
  // Session State
  const [currentFarmer, setCurrentFarmer] = useState<Farmer | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [assets, setAssets] = useState<FarmerAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Auth Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState<string>(initialFarmerPhone || '');
  const [loginPin, setLoginPin] = useState<string>('1234');

  // Registration Form
  const [regForm, setRegForm] = useState({
    fullName: '',
    nationalId: '',
    phone: '',
    email: '',
    gender: 'Male' as 'Male' | 'Female',
    dob: '1990-01-01',
    region: 'Kaduna State',
    district: 'Giwa LGA',
    village: '',
    farmSizeHectares: 3.5,
    ownershipStatus: 'Owned' as 'Owned' | 'Leased' | 'Communal' | 'Cooperative',
    primaryCrops: 'Maize, Soybeans',
    soilType: 'Loamy' as any,
    irrigationType: 'Rainfed' as any,
    cooperativeName: '',
    bankName: 'First Bank of Nigeria',
    accountNumber: '',
    pin: '1234'
  });

  // Active Sub-Tab for logged in farmer
  const [activeTab, setActiveTab] = useState<'dashboard' | 'loans' | 'assets' | 'profile'>('dashboard');

  // Modals
  const [isApplyLoanOpen, setIsApplyLoanOpen] = useState(false);
  const [isUploadAssetOpen, setIsUploadAssetOpen] = useState(false);
  const [isRepayOpen, setIsRepayOpen] = useState(false);
  const [selectedLoanForRepay, setSelectedLoanForRepay] = useState<Loan | null>(null);

  // New Loan Form State
  const [loanForm, setLoanForm] = useState({
    purpose: 'Seed & Fertilizer' as any,
    amountRequested: 1500000,
    durationMonths: 6,
    repaymentFrequency: 'Monthly' as any,
    collateralDescription: '',
    guarantorName: '',
    guarantorPhone: '',
    notes: ''
  });

  // New Asset Form State
  const [assetForm, setAssetForm] = useState({
    assetName: '',
    assetType: 'Tractor' as any,
    purchaseYear: 2024,
    condition: 'Excellent' as any,
    estimatedValueNaira: 2500000,
    serialNumber: '',
    documentRef: '',
    specifications: ''
  });

  // Repayment Form State
  const [repayAmount, setRepayAmount] = useState<number>(250000);
  const [repayMethod, setRepayMethod] = useState<any>('Bank Transfer');
  const [repayRef, setRepayRef] = useState<string>('');

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // If initial phone provided, attempt auto-login
  useEffect(() => {
    if (initialFarmerPhone && !currentFarmer) {
      setLoginIdentifier(initialFarmerPhone);
      handlePerformLogin(initialFarmerPhone, '1234');
    }
  }, [initialFarmerPhone]);

  const handlePerformLogin = async (id: string, pin: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.farmerLogin(id, pin);
      setCurrentFarmer(data.farmer);
      setLoans(data.loans);
      setAssets(data.assets);
      showToast(`Welcome back, ${data.farmer.fullName}!`);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your phone number or PIN.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier) {
      setError('Please provide your phone number or National ID (NIN)');
      return;
    }
    handlePerformLogin(loginIdentifier, loginPin);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.fullName || !regForm.phone) {
      setError('Please fill in your Full Name and Mobile Phone Number');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const primaryCropsArray = regForm.primaryCrops
        .split(',')
        .map(c => c.trim())
        .filter(Boolean);

      const res = await api.farmerRegister({
        ...regForm,
        primaryCrops: primaryCropsArray.length > 0 ? primaryCropsArray : ['Maize']
      });

      setCurrentFarmer(res.farmer);
      setLoans(res.loans || []);
      setAssets(res.assets || []);
      showToast(`Farmer account created successfully! Your Farmer Code is ${res.farmer.farmerCode}`);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const refreshFarmerData = async () => {
    if (!currentFarmer) return;
    try {
      const res = await api.getFarmerDashboard(currentFarmer.id);
      setCurrentFarmer(res.farmer);
      setLoans(res.loans);
      setAssets(res.assets);
    } catch (err) {
      console.error('Failed to refresh data', err);
    }
  };

  const handleApplyLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFarmer) return;

    setLoading(true);
    try {
      await api.farmerApplyLoan({
        farmerId: currentFarmer.id,
        purpose: loanForm.purpose,
        amountRequested: Number(loanForm.amountRequested),
        durationMonths: Number(loanForm.durationMonths),
        repaymentFrequency: loanForm.repaymentFrequency,
        collateralDescription: loanForm.collateralDescription || 'Harvest crop lien',
        guarantorName: loanForm.guarantorName || currentFarmer.cooperativeName,
        guarantorPhone: loanForm.guarantorPhone,
        notes: loanForm.notes
      });

      showToast(`Loan application of ₦${Number(loanForm.amountRequested).toLocaleString()} submitted for approval.`);
      setIsApplyLoanOpen(false);
      await refreshFarmerData();
      setActiveTab('loans');
    } catch (err: any) {
      setError(err.message || 'Failed to submit loan application');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAssetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFarmer) return;

    setLoading(true);
    try {
      await api.uploadFarmerAsset({
        farmerId: currentFarmer.id,
        farmerName: currentFarmer.fullName,
        assetName: assetForm.assetName,
        assetType: assetForm.assetType,
        purchaseYear: Number(assetForm.purchaseYear),
        condition: assetForm.condition,
        estimatedValueNaira: Number(assetForm.estimatedValueNaira),
        serialNumber: assetForm.serialNumber,
        documentRef: assetForm.documentRef,
        specifications: assetForm.specifications
      });

      showToast(`Farm asset "${assetForm.assetName}" registered successfully.`);
      setIsUploadAssetOpen(false);
      setAssetForm({
        assetName: '',
        assetType: 'Tractor',
        purchaseYear: 2024,
        condition: 'Excellent',
        estimatedValueNaira: 2500000,
        serialNumber: '',
        documentRef: '',
        specifications: ''
      });
      await refreshFarmerData();
      setActiveTab('assets');
    } catch (err: any) {
      setError(err.message || 'Failed to upload asset');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!currentFarmer) return;
    if (!confirm('Are you sure you want to remove this farm asset?')) return;

    try {
      await api.deleteFarmerAsset(currentFarmer.id, assetId);
      showToast('Asset removed.');
      await refreshFarmerData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete asset');
    }
  };

  const handleRepaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanForRepay || !currentFarmer) return;

    setLoading(true);
    try {
      await api.recordRepayment(selectedLoanForRepay.id, {
        amount: Number(repayAmount),
        paymentMethod: repayMethod,
        referenceNo: repayRef || `TX-SELF-${Date.now().toString().slice(-6)}`,
        recordedBy: `${currentFarmer.fullName} (Self-Service)`,
        notes: `Online self-payment via ${repayMethod}`
      });

      showToast(`Repayment of ₦${Number(repayAmount).toLocaleString()} recorded successfully!`);
      setIsRepayOpen(false);
      setSelectedLoanForRepay(null);
      await refreshFarmerData();
    } catch (err: any) {
      setError(err.message || 'Failed to process repayment');
    } finally {
      setLoading(false);
    }
  };

  // Calculations for farmer metrics
  const activeLoans = loans.filter(l => ['Disbursed', 'Repaying'].includes(l.status));
  const activeDebt = activeLoans.reduce((sum, l) => sum + (l.outstandingBalance || 0), 0);
  const totalRepaid = loans.reduce((sum, l) => sum + (l.totalRepaid || 0), 0);
  const totalAssetValue = assets.reduce((sum, a) => sum + (a.estimatedValueNaira || 0), 0);

  // -------------------------------------------------------------
  // VIEW: NOT LOGGED IN (Login or Register)
  // -------------------------------------------------------------
  if (!currentFarmer) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
        {/* Top Header */}
        <header className="bg-emerald-900 text-white py-4 px-6 border-b border-emerald-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onReturnToHome}
              className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-200 transition cursor-pointer"
              title="Return to Homepage"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Sprout className="w-6 h-6 text-emerald-300" />
              <span className="font-bold text-lg text-white">AgriCore Farmer Portal</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-800 text-emerald-300 border border-emerald-700">
                Self-Service
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSwitchToAdmin}
              className="text-xs text-emerald-200 hover:text-white font-medium transition cursor-pointer"
            >
              Switch to Officer ERP →
            </button>
          </div>
        </header>

        {/* Main Auth Container */}
        <div className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 my-auto">
          {/* Success / Error alerts */}
          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successToast && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            {/* Tab switch: Sign In vs Register */}
            <div className="grid grid-cols-2 border-b border-stone-200 text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(null); }}
                className={`py-3.5 transition cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-emerald-800 border-b-2 border-emerald-700'
                    : 'bg-stone-50 text-stone-500 hover:text-stone-800'
                }`}
              >
                Farmer Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setError(null); }}
                className={`py-3.5 transition cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white text-emerald-800 border-b-2 border-emerald-700'
                    : 'bg-stone-50 text-stone-500 hover:text-stone-800'
                }`}
              >
                Register as New Farmer
              </button>
            </div>

            <div className="p-6">
              {authMode === 'login' ? (
                /* --- LOGIN FORM --- */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="text-center mb-5">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-stone-900">Sign in to your Farm Dashboard</h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Enter your registered Phone Number or NIN to access loans and assets.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mobile Phone Number or NIN
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 08032194481 or NIN-78491023812"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-emerald-600 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-stone-700">
                        4-Digit Security PIN
                      </label>
                      <span className="text-[11px] text-stone-400">Default PIN: 1234</span>
                    </div>
                    <input
                      type="password"
                      maxLength={4}
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-emerald-600 focus:bg-white transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Authenticating...' : 'Sign In to Portal'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Fast Demo Logins */}
                  <div className="mt-6 pt-5 border-t border-stone-200">
                  </div>
                </form>
              ) : (
                /* --- REGISTRATION FORM --- */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-bold text-stone-900">Register as an Individual Farmer</h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Join the AgriProduce network to access micro-loans in Naira and catalog farm assets.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Babatunde Balogun"
                        value={regForm.fullName}
                        onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 08012345678"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        National ID (NIN)
                      </label>
                      <input
                        type="text"
                        placeholder="11-digit National ID"
                        value={regForm.nationalId}
                        onChange={(e) => setRegForm({ ...regForm, nationalId: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        State (Region) *
                      </label>
                      <select
                        value={regForm.region}
                        onChange={(e) => setRegForm({ ...regForm, region: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      >
                        <option value="Kaduna State">Kaduna State</option>
                        <option value="Kano State">Kano State</option>
                        <option value="Ogun State">Ogun State</option>
                        <option value="Benue State">Benue State</option>
                        <option value="Plateau State">Plateau State</option>
                        <option value="Oyo State">Oyo State</option>
                        <option value="Niger State">Niger State</option>
                        <option value="Edo State">Edo State</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Local Government Area (LGA)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Giwa, Dambatta, Owode"
                        value={regForm.district}
                        onChange={(e) => setRegForm({ ...regForm, district: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Farm Size (Hectares) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.5"
                        value={regForm.farmSizeHectares}
                        onChange={(e) => setRegForm({ ...regForm, farmSizeHectares: parseFloat(e.target.value) || 1 })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Primary Crops (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Maize, Rice, Cassava"
                        value={regForm.primaryCrops}
                        onChange={(e) => setRegForm({ ...regForm, primaryCrops: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Soil Type
                      </label>
                      <select
                        value={regForm.soilType}
                        onChange={(e) => setRegForm({ ...regForm, soilType: e.target.value as any })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      >
                        <option value="Loamy">Loamy</option>
                        <option value="Sandy">Sandy</option>
                        <option value="Clay">Clay</option>
                        <option value="Silt">Silt</option>
                        <option value="Volcanic">Volcanic</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Cooperative Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kaduna Grain Union"
                        value={regForm.cooperativeName}
                        onChange={(e) => setRegForm({ ...regForm, cooperativeName: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Create 4-Digit Portal PIN *
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={regForm.pin}
                        onChange={(e) => setRegForm({ ...regForm, pin: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {loading ? 'Creating Account...' : 'Complete Registration & Open Dashboard'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: LOGGED IN FARMER DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 border border-emerald-500/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Farmer Portal Header */}
      <header className="bg-emerald-900 text-white sticky top-0 z-30 shadow-sm border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3.5 border-b border-emerald-800/80 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white ring-1 ring-emerald-500/40">
                <Sprout className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white">{currentFarmer.fullName}</h1>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-800 text-emerald-300 border border-emerald-700">
                    {currentFarmer.farmerCode}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    currentFarmer.kycStatus === 'Verified' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    KYC: {currentFarmer.kycStatus}
                  </span>
                </div>
                <p className="text-xs text-emerald-300/90">
                  {currentFarmer.district}, {currentFarmer.region} • {currentFarmer.farmSizeHectares} ha • Credit Rating: Tier {currentFarmer.creditRating}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsApplyLoanOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Apply for Loan (₦)</span>
              </button>
              <button
                onClick={() => setIsUploadAssetOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-600 font-semibold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-300" />
                <span>Upload Asset</span>
              </button>
              <button
                onClick={() => setCurrentFarmer(null)}
                className="p-2 rounded-lg bg-emerald-950/60 hover:bg-rose-900/60 text-emerald-300 hover:text-rose-200 border border-emerald-800 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 pt-2 pb-2 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dashboard Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('loans')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'loans'
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>My Loans ({loans.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'assets'
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Tractor className="w-3.5 h-3.5" />
              <span>My Farm Assets ({assets.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Farm Dossier</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* ================= TAB 1: DASHBOARD OVERVIEW ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top 4 KPI Metrics in Naira */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-xs font-medium">Active Micro-Debt</span>
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-xl font-bold text-stone-900">
                  ₦{activeDebt.toLocaleString()}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  Across {activeLoans.length} active credit facility
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-xs font-medium">Total Repaid in Naira</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xl font-bold text-emerald-800">
                  ₦{totalRepaid.toLocaleString()}
                </p>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">
                  100% on-time record
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-xs font-medium">Registered Farm Assets</span>
                  <Tractor className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-xl font-bold text-stone-900">
                  ₦{totalAssetValue.toLocaleString()}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  {assets.length} equipment / machinery units
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="text-xs font-medium">Cultivated Land</span>
                  <Sprout className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-xl font-bold text-stone-900">
                  {currentFarmer.farmSizeHectares} Hectares
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  {currentFarmer.primaryCrops.join(', ')}
                </p>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-sm font-bold text-emerald-950">Need seasonal financing or equipment?</h3>
                <p className="text-xs text-emerald-800">
                  Apply for low-interest input loans in Naira or register your machinery to unlock higher credit limits.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsApplyLoanOpen(true)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Apply for Loan (₦)</span>
                </button>
                <button
                  onClick={() => setIsUploadAssetOpen(true)}
                  className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Upload Asset</span>
                </button>
              </div>
            </div>

            {/* Two Column Section: Recent Loan Status + Registered Assets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left: Active Loan Status */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-700" />
                    <h3 className="font-bold text-stone-900 text-sm">Active Credit & Repayment Status</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('loans')}
                    className="text-xs text-emerald-700 hover:underline font-medium"
                  >
                    View All ({loans.length}) →
                  </button>
                </div>

                {loans.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 text-xs">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    <p>No loan applications submitted yet.</p>
                    <button
                      onClick={() => setIsApplyLoanOpen(true)}
                      className="mt-2 text-emerald-700 font-semibold underline cursor-pointer"
                    >
                      Apply for your first loan
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loans.slice(0, 2).map(loan => (
                      <div key={loan.id} className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-stone-900">{loan.purpose}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            loan.status === 'Disbursed' || loan.status === 'Repaying' ? 'bg-emerald-100 text-emerald-800' :
                            loan.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                            loan.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {loan.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 text-xs">
                          <div>
                            <span className="text-stone-500">Approved:</span>
                            <span className="font-semibold text-stone-800 ml-1">
                              ₦{(loan.amountApproved || loan.amountRequested).toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-500">Remaining:</span>
                            <span className="font-bold text-emerald-800 ml-1">
                              ₦{loan.outstandingBalance.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {loan.amountApproved > 0 && (
                          <div>
                            <div className="flex justify-between text-[10px] text-stone-500 mb-1">
                              <span>Repaid: ₦{loan.totalRepaid.toLocaleString()}</span>
                              <span>
                                {Math.round((loan.totalRepaid / (loan.totalRepaid + loan.outstandingBalance || 1)) * 100)}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-600 rounded-full"
                                style={{
                                  width: `${Math.min(100, (loan.totalRepaid / (loan.totalRepaid + loan.outstandingBalance || 1)) * 100)}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => {
                              setSelectedLoanForRepay(loan);
                              setIsRepayOpen(true);
                            }}
                            className="text-xs px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-medium transition cursor-pointer"
                          >
                            Pay Installment in ₦
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Uploaded Machinery & Farm Assets */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <Tractor className="w-4 h-4 text-emerald-700" />
                    <h3 className="font-bold text-stone-900 text-sm">My Registered Assets & Machinery</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('assets')}
                    className="text-xs text-emerald-700 hover:underline font-medium"
                  >
                    Manage ({assets.length}) →
                  </button>
                </div>

                {assets.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 text-xs">
                    <Tractor className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    <p>No farm equipment or machinery registered yet.</p>
                    <button
                      onClick={() => setIsUploadAssetOpen(true)}
                      className="mt-2 text-emerald-700 font-semibold underline cursor-pointer"
                    >
                      + Register your first asset
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assets.slice(0, 3).map(asset => (
                      <div key={asset.id} className="p-3 rounded-lg border border-stone-200 bg-stone-50/50 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="font-bold text-xs text-stone-900">{asset.assetName}</p>
                          <p className="text-[11px] text-stone-500">
                            {asset.assetType} • Year {asset.purchaseYear} • Condition: {asset.condition}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-emerald-800">
                            ₦{asset.estimatedValueNaira.toLocaleString()}
                          </p>
                          <span className="text-[10px] text-stone-400">Collateral Value</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 2: MY LOANS & CREDIT ================= */}
        {activeTab === 'loans' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-stone-900">My Credit & Loan Portfolio</h2>
                <p className="text-xs text-stone-500">
                  Track disbursements, view calculated monthly installments, and pay in Nigerian Naira (₦).
                </p>
              </div>
              <button
                onClick={() => setIsApplyLoanOpen(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Apply for New Loan in ₦</span>
              </button>
            </div>

            {loans.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-stone-200 text-stone-400 space-y-3">
                <DollarSign className="w-12 h-12 mx-auto text-stone-300" />
                <h3 className="font-bold text-stone-700 text-sm">No Active or Past Loans</h3>
                <p className="text-xs max-w-sm mx-auto">
                  You have not applied for agricultural credit yet. Subsidized input loans for seeds, solar irrigation, and fertilizer are available.
                </p>
                <button
                  onClick={() => setIsApplyLoanOpen(true)}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition cursor-pointer"
                >
                  Start Loan Application
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {loans.map(loan => (
                  <div key={loan.id} className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
                    {/* Header */}
                    <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-900">{loan.purpose}</span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                            {loan.loanCode}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Applied: {loan.applicationDate} • Due Date: {loan.dueDate} • Tenor: {loan.durationMonths} Mos ({loan.repaymentFrequency})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                          loan.status === 'Disbursed' || loan.status === 'Repaying' ? 'bg-emerald-100 text-emerald-800' :
                          loan.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                          loan.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          Status: {loan.status}
                        </span>

                        {['Disbursed', 'Repaying'].includes(loan.status) && (
                          <button
                            onClick={() => {
                              setSelectedLoanForRepay(loan);
                              setIsRepayOpen(true);
                            }}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded transition cursor-pointer"
                          >
                            Pay Installment in ₦
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-stone-100">
                      <div>
                        <span className="text-stone-500 block">Requested Amount</span>
                        <span className="font-bold text-stone-900 text-sm">
                          ₦{loan.amountRequested.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Approved Amount</span>
                        <span className="font-bold text-emerald-800 text-sm">
                          ₦{(loan.amountApproved || loan.amountRequested).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Total Repaid in Naira</span>
                        <span className="font-bold text-emerald-700 text-sm">
                          ₦{loan.totalRepaid.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Remaining Balance</span>
                        <span className="font-bold text-stone-900 text-sm">
                          ₦{loan.outstandingBalance.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Installments Table */}
                    {loan.installments && loan.installments.length > 0 && (
                      <div className="p-4 sm:p-5 bg-stone-50/30">
                        <p className="text-xs font-bold text-stone-700 mb-2">Installment Repayment Schedule</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-stone-200 text-stone-500 text-[11px]">
                                <th className="py-1.5 font-semibold">Installment</th>
                                <th className="py-1.5 font-semibold">Due Date</th>
                                <th className="py-1.5 font-semibold">Amount Due (₦)</th>
                                <th className="py-1.5 font-semibold">Amount Paid (₦)</th>
                                <th className="py-1.5 font-semibold">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                              {loan.installments.map(inst => (
                                <tr key={inst.installmentNumber}>
                                  <td className="py-2 font-medium">#{inst.installmentNumber}</td>
                                  <td className="py-2 text-stone-600">{inst.dueDate}</td>
                                  <td className="py-2 font-bold text-stone-800">₦{inst.amountDue.toLocaleString()}</td>
                                  <td className="py-2 text-stone-600">₦{inst.amountPaid.toLocaleString()}</td>
                                  <td className="py-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      inst.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                                    }`}>
                                      {inst.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: MY FARM ASSETS ================= */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-stone-900">My Farm Equipment & Machinery</h2>
                <p className="text-xs text-stone-500">
                  Upload and catalog your personal tractors, solar pumps, mills, and storage cribs.
                </p>
              </div>
              <button
                onClick={() => setIsUploadAssetOpen(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-200" />
                <span>Upload New Asset</span>
              </button>
            </div>

            {assets.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-stone-200 text-stone-400 space-y-3">
                <Tractor className="w-12 h-12 mx-auto text-stone-300" />
                <h3 className="font-bold text-stone-700 text-sm">No Farm Assets Uploaded Yet</h3>
                <p className="text-xs max-w-sm mx-auto">
                  Registering your agricultural machinery acts as proof of productive capacity and can serve as collateral for higher micro-loan limits.
                </p>
                <button
                  onClick={() => setIsUploadAssetOpen(true)}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition cursor-pointer"
                >
                  Register First Asset
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map(asset => (
                  <div key={asset.id} className="bg-white rounded-xl border border-stone-200 shadow-2xs p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {asset.assetType}
                          </span>
                          <h3 className="font-bold text-sm text-stone-900 mt-1">{asset.assetName}</h3>
                        </div>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="text-stone-400 hover:text-rose-600 transition p-1 cursor-pointer"
                          title="Delete asset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-lg space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Valuation:</span>
                          <span className="font-bold text-emerald-800">
                            ₦{asset.estimatedValueNaira.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Condition:</span>
                          <span className="font-semibold text-stone-800">{asset.condition}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Purchase Year:</span>
                          <span className="text-stone-800">{asset.purchaseYear}</span>
                        </div>
                        {asset.serialNumber && (
                          <div className="flex justify-between">
                            <span className="text-stone-500">Serial No:</span>
                            <span className="font-mono text-[11px] text-stone-700">{asset.serialNumber}</span>
                          </div>
                        )}
                      </div>

                      {asset.specifications && (
                        <p className="text-xs text-stone-600 italic">
                          "{asset.specifications}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                      <span>Registered: {asset.registeredDate}</span>
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Asset
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: MY FARM DOSSIER ================= */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-6 space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="text-base font-bold text-stone-900">Farmer Agricultural Dossier</h2>
              <p className="text-xs text-stone-500">
                Official registration credentials on the AgriCore national agricultural registry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <h3 className="font-bold text-stone-800 border-b border-stone-100 pb-1">Identity & Location</h3>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-stone-500">Farmer Code:</span>
                  <span className="font-mono font-bold text-emerald-900">{currentFarmer.farmerCode}</span>
                  
                  <span className="text-stone-500">Full Name:</span>
                  <span className="font-semibold text-stone-800">{currentFarmer.fullName}</span>

                  <span className="text-stone-500">National ID (NIN):</span>
                  <span className="font-mono text-stone-800">{currentFarmer.nationalId}</span>

                  <span className="text-stone-500">Phone Number:</span>
                  <span className="font-semibold text-stone-800">{currentFarmer.phone}</span>

                  <span className="text-stone-500">State / Region:</span>
                  <span className="text-stone-800">{currentFarmer.region}</span>

                  <span className="text-stone-500">Local Govt (LGA):</span>
                  <span className="text-stone-800">{currentFarmer.district}</span>

                  <span className="text-stone-500">Village / Community:</span>
                  <span className="text-stone-800">{currentFarmer.village || 'Central Zone'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-stone-800 border-b border-stone-100 pb-1">Land & Agronomic Specs</h3>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-stone-500">Farm Size:</span>
                  <span className="font-bold text-stone-800">{currentFarmer.farmSizeHectares} Hectares</span>

                  <span className="text-stone-500">Land Title Status:</span>
                  <span className="text-stone-800">{currentFarmer.ownershipStatus}</span>

                  <span className="text-stone-500">Soil Type:</span>
                  <span className="text-stone-800">{currentFarmer.soilType}</span>

                  <span className="text-stone-500">Irrigation System:</span>
                  <span className="text-stone-800">{currentFarmer.irrigationType}</span>

                  <span className="text-stone-500">Primary Crops:</span>
                  <span className="font-semibold text-emerald-800">{currentFarmer.primaryCrops.join(', ')}</span>

                  <span className="text-stone-500">Cooperative Union:</span>
                  <span className="text-stone-800">{currentFarmer.cooperativeName}</span>

                  <span className="text-stone-500">Bank Account:</span>
                  <span className="text-stone-800">{currentFarmer.bankName} ({currentFarmer.accountNumber || 'Pending'})</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= MODAL: APPLY FOR LOAN ================= */}
      {isApplyLoanOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-8">
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-emerald-900 text-white">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">Apply for Agricultural Micro-Loan</h3>
              </div>
              <button
                onClick={() => setIsApplyLoanOpen(false)}
                className="text-emerald-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLoanSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Loan Purpose *
                </label>
                <select
                  value={loanForm.purpose}
                  onChange={(e) => setLoanForm({ ...loanForm, purpose: e.target.value as any })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                >
                  <option value="Seed & Fertilizer">Seed & Fertilizer (Hybrid inputs)</option>
                  <option value="Solar Water Pump">Solar Water Pump / Irrigation Borehole</option>
                  <option value="Irrigation Equipment">Drip & Canal Irrigation Network</option>
                  <option value="Tractor & Machinery">Tractor Hire & Mechanization</option>
                  <option value="Post-Harvest Storage">Post-Harvest Grain Silos / Storage</option>
                  <option value="Livestock Feed & Care">Livestock Feed & Veterinary Care</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Requested Amount in Nigerian Naira (₦) *
                </label>
                <input
                  type="number"
                  step="50000"
                  min="100000"
                  max="10000000"
                  required
                  value={loanForm.amountRequested}
                  onChange={(e) => setLoanForm({ ...loanForm, amountRequested: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm font-bold text-emerald-900"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Standard subsidized interest rate: 6.5% APR.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Duration (Months)
                  </label>
                  <select
                    value={loanForm.durationMonths}
                    onChange={(e) => setLoanForm({ ...loanForm, durationMonths: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months (Single Season)</option>
                    <option value={12}>12 Months (Full Year)</option>
                    <option value={24}>24 Months (Machinery)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Repayment Frequency
                  </label>
                  <select
                    value={loanForm.repaymentFrequency}
                    onChange={(e) => setLoanForm({ ...loanForm, repaymentFrequency: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="Monthly">Monthly Installments</option>
                    <option value="Seasonal Harvest">Seasonal Harvest Lump-Sum</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Pledged Collateral or Produce Off-Take Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Warehouse receipt for 10 MT Maize or Land Deed"
                  value={loanForm.collateralDescription}
                  onChange={(e) => setLoanForm({ ...loanForm, collateralDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Guarantor Cooperative / Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kaduna Grain Union"
                    value={loanForm.guarantorName}
                    onChange={(e) => setLoanForm({ ...loanForm, guarantorName: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Guarantor Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 08020001122"
                    value={loanForm.guarantorPhone}
                    onChange={(e) => setLoanForm({ ...loanForm, guarantorPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApplyLoanOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition shadow-xs cursor-pointer"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: UPLOAD ASSET ================= */}
      {isUploadAssetOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-8">
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-emerald-900 text-white">
              <div className="flex items-center gap-2">
                <Tractor className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">Register & Upload Farm Asset / Machinery</h3>
              </div>
              <button
                onClick={() => setIsUploadAssetOpen(false)}
                className="text-emerald-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadAssetSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Asset / Equipment Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahindra 575 DI Tractor or 5HP Solar Pump"
                  value={assetForm.assetName}
                  onChange={(e) => setAssetForm({ ...assetForm, assetName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={assetForm.assetType}
                    onChange={(e) => setAssetForm({ ...assetForm, assetType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="Tractor">Tractor / Mechanization</option>
                    <option value="Solar Irrigation Pump">Solar Irrigation Pump</option>
                    <option value="Harvester">Harvester / Thresher</option>
                    <option value="Storage Silo / Crib">Storage Silo / Grain Crib</option>
                    <option value="Greenhouse">Greenhouse Unit</option>
                    <option value="Processing Mill">Processing Mill / Grater</option>
                    <option value="Sprayer / Implement">Sprayer / Implement / Plow</option>
                    <option value="Other Machinery">Other Farm Machinery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Estimated Value in Naira (₦) *
                  </label>
                  <input
                    type="number"
                    step="50000"
                    min="50000"
                    required
                    value={assetForm.estimatedValueNaira}
                    onChange={(e) => setAssetForm({ ...assetForm, estimatedValueNaira: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-bold text-emerald-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Purchase Year
                  </label>
                  <input
                    type="number"
                    min="2010"
                    max={new Date().getFullYear()}
                    value={assetForm.purchaseYear}
                    onChange={(e) => setAssetForm({ ...assetForm, purchaseYear: parseInt(e.target.value) || 2024 })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Current Condition
                  </label>
                  <select
                    value={assetForm.condition}
                    onChange={(e) => setAssetForm({ ...assetForm, condition: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Needs Repair">Needs Repair</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Serial Number / Chassis No (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TRC-78192-NG"
                  value={assetForm.serialNumber}
                  onChange={(e) => setAssetForm({ ...assetForm, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Specifications & Model Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 45HP diesel engine, includes 3-disc plow and heavy duty ridger..."
                  value={assetForm.specifications}
                  onChange={(e) => setAssetForm({ ...assetForm, specifications: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadAssetOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition shadow-xs cursor-pointer"
                >
                  {loading ? 'Uploading...' : 'Save Asset to Registry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: MAKE REPAYMENT IN NAIRA ================= */}
      {isRepayOpen && selectedLoanForRepay && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-8">
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-emerald-900 text-white">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">Pay Loan Installment in ₦</h3>
              </div>
              <button
                onClick={() => setIsRepayOpen(false)}
                className="text-emerald-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRepaySubmit} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <p className="font-bold text-emerald-950">{selectedLoanForRepay.purpose}</p>
                <div className="flex justify-between text-emerald-800">
                  <span>Outstanding Balance:</span>
                  <span className="font-bold">₦{selectedLoanForRepay.outstandingBalance.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Repayment Amount (₦) *
                </label>
                <input
                  type="number"
                  min="1000"
                  max={selectedLoanForRepay.outstandingBalance}
                  required
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm font-bold text-emerald-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Payment Method *
                </label>
                <select
                  value={repayMethod}
                  onChange={(e) => setRepayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                >
                  <option value="Mobile Money (OPay / PalmPay / MoMo)">Mobile Money (OPay / PalmPay / MoMo)</option>
                  <option value="Bank Transfer">Bank Transfer (First Bank / Zenith / Access)</option>
                  <option value="Cash / Agent">Cooperative Cash / Field Agent</option>
                  <option value="Harvest Deduction">Harvest Off-take Deduction</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Transaction Reference Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. OPAY-918204 or TXN-FB-330192"
                  value={repayRef}
                  onChange={(e) => setRepayRef(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRepayOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition shadow-xs cursor-pointer"
                >
                  {loading ? 'Processing...' : 'Confirm Repayment (₦)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
