import React from 'react';
import { 
  Sprout, 
  Users, 
  DollarSign, 
  Warehouse, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Tractor, 
  Sun, 
  Droplets, 
  Smartphone, 
  TrendingUp, 
  Sparkles,
  Building,
  UserCheck,
  FileText
} from 'lucide-react';
import { SystemStats } from '../types';

interface HomepageProps {
  stats: SystemStats | null;
  onEnterFarmerPortal: () => void;
  onEnterAdmin: () => void;
  onQuickLoginFarmer: (phone: string) => void;
}

export const Homepage: React.FC<HomepageProps> = ({
  stats,
  onEnterFarmerPortal,
  onEnterAdmin,
  onQuickLoginFarmer
}) => {
  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const totalNaira = stats?.totalCapitalDisbursedNaira ?? 8500000;
  const totalFarmers = stats?.totalFarmers ?? 5;
  const totalAssets = (stats?.totalInfrastructureAssets ?? 4) + (stats?.totalFarmerAssets ?? 4);
  const totalHectares = stats?.totalHectaresCultivated ?? 65.7;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans">
      {/* Top Banner Bar */}
      <div className="bg-emerald-950 text-emerald-200 text-xs py-2 px-4 border-b border-emerald-900/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">AgriProduce Nigeria</span>
            <span>• Digital Agriculture & Micro-Credit Infrastructure</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Currency: <strong>Nigerian Naira (₦ NGN)</strong></span>
            <span className="hidden md:inline">• Support Hotline: 0800-AGRI-PRODUCE</span>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Sprout className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-emerald-950">AgriProduce</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Nigeria
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">Smallholder Registration & Credit Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onEnterFarmerPortal}
              className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <span>Farmer Portal</span>
            </button>
            <button
              onClick={onEnterAdmin}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Building className="w-4 h-4 text-emerald-300" />
              <span>Cooperative / Officer ERP</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-18 md:pb-24 bg-gradient-to-b from-emerald-50/70 via-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Mission & Call to action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300/70 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Empowering Nigerian Farmers with Instant Capital & Tools</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.18]">
                Smart Agricultural Credit, Asset Registry & Farm Management in <span className="text-emerald-700 underline decoration-emerald-400 decoration-wavy underline-offset-6">Nigeria</span>
              </h1>

              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                AgriProduce connects individual Nigerian smallholders and cooperatives to flexible input financing, machinery assets, and grain infrastructure. Register your farm online, apply for micro-credit, and manage your equipment all in one platform.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={onEnterFarmerPortal}
                  className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Smartphone className="w-5 h-5 text-emerald-200" />
                  <span>Register or Login as a Farmer</span>
                  <ArrowRight className="w-4 h-4 text-emerald-200 ml-1" />
                </button>

                <button
                  onClick={onEnterAdmin}
                  className="px-5 py-3.5 bg-white hover:bg-stone-100 text-stone-800 font-semibold text-sm rounded-xl border border-stone-300 shadow-xs hover:border-stone-400 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Building className="w-4 h-4 text-stone-500" />
                  <span>Access Management ERP</span>
                </button>
              </div>

              {/* Quick Demo Login Bar for Testing */}
              {/* <div className="p-3.5 bg-emerald-900/5 rounded-xl border border-emerald-700/15 max-w-xl">
                <p className="text-xs font-bold text-emerald-950 mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Try Instant Farmer Portal Login:</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onQuickLoginFarmer('08032194481')}
                    className="text-xs px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-md font-medium transition cursor-pointer shadow-2xs"
                  >
                    Amara Okafor (Kaduna - 12.5 ha)
                  </button>
                  <button
                    onClick={() => onQuickLoginFarmer('08123456789')}
                    className="text-xs px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-md font-medium transition cursor-pointer shadow-2xs"
                  >
                    Ibrahim Garba (Kano - 24 ha)
                  </button>
                  <button
                    onClick={() => onQuickLoginFarmer('08055678901')}
                    className="text-xs px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-md font-medium transition cursor-pointer shadow-2xs"
                  >
                    Oluwaseun Adeleke (Ogun - 8.5 ha)
                  </button>
                </div>
              </div>
            </div> */}

            {/* Right Column: Live Metric Cards */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-emerald-800/15 shadow-md space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-700" />
                    <h3 className="font-bold text-stone-900 text-sm">Live Platform Metrics (Nigeria)</h3>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Real-Time DB
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
                    <p className="text-[11px] font-medium text-stone-500">Disbursed Micro-Credit</p>
                    <p className="text-xl font-bold text-emerald-800 mt-1">
                      {formatNaira(totalNaira)}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">Flexible seasonal tenor</p>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
                    <p className="text-[11px] font-medium text-stone-500">Registered Smallholders</p>
                    <p className="text-xl font-bold text-stone-900 mt-1">
                      {totalFarmers} Farmers
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium mt-0.5">100% KYC verified</p>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
                    <p className="text-[11px] font-medium text-stone-500">Total Cultivated Land</p>
                    <p className="text-xl font-bold text-stone-900 mt-1">
                      {totalHectares} Ha
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">Across Nigerian states</p>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
                    <p className="text-[11px] font-medium text-stone-500">Assets & Machinery</p>
                    <p className="text-xl font-bold text-emerald-800 mt-1">
                      {totalAssets} Units
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">Silos, pumps & tractors</p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-emerald-950">Ready to register your farm?</p>
                    <p className="text-emerald-800 text-[11px]">Takes under 2 minutes. Free registration.</p>
                  </div>
                  <button
                    onClick={onEnterFarmerPortal}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
                  >
                    Start Now
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-14 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Designed for Nigerian Smallholders, Cooperatives & Agribusinesses
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              Everything required to document land tenure, secure capital, and manage post-harvest value addition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 hover:border-emerald-300 transition hover:shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Self-Service Farmer Portal</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                Farmers can register on their own using their National ID (NIN) and phone number. Access your personal dashboard, check credit scores, and manage your farm dossier.
              </p>
              <ul className="text-xs text-stone-500 space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Instant 4-digit PIN security</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Multi-crop & soil classification</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 hover:border-emerald-300 transition hover:shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Naira Micro-Loans & Input Credit</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                Apply directly for subsidized financing for seeds, fertilizer, solar pumps, or tractor hire in Nigeria. View automated monthly or seasonal harvest schedules.
              </p>
              <ul className="text-xs text-stone-500 space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Automated installment calculations</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>OPay, PalmPay, MoMo & Bank Transfer</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 hover:border-emerald-300 transition hover:shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Tractor className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Farm Machinery & Asset Uploads</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                Farmers can upload and register their personal farm equipment (tractors, pumps, sprayers, mills) to boost collateral valuation and unlock higher credit limits.
              </p>
              <ul className="text-xs text-stone-500 space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Condition ratings & Naira valuation</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Community silos & borehole telematics</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Step-by-Step */}
      <section className="py-14 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">How It Works for Farmers</h2>
            <p className="text-stone-500 text-xs mt-1">Get registered and credit-ready in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Register Online</h4>
              <p className="text-stone-500 text-xs">
                Enter your full name, NIN, mobile phone, state/LGA, farm size in hectares, and primary crops (Maize, Rice, Cassava, Yam).
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Upload Your Assets</h4>
              <p className="text-stone-500 text-xs">
                Catalog your irrigation pumps, implements, tractors, or processing mills to establish proof of farming capacity and collateral.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Apply for Credit</h4>
              <p className="text-stone-500 text-xs">
                Submit a loan application for seeds, fertilizer, or mechanization. Track approval and disburse directly to your bank or mobile wallet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-stone-900 text-stone-400 py-10 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white">
              <Sprout className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-white font-bold">AgriProduce Agricultural Management System</p>
              <p className="text-[11px] text-stone-500">Nigeria Smallholder Inclusion & Infrastructure Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onEnterFarmerPortal}
              className="text-emerald-400 hover:text-emerald-300 transition cursor-pointer font-medium"
            >
              Farmer Portal
            </button>
            <span>•</span>
            <button
              onClick={onEnterAdmin}
              className="text-stone-300 hover:text-white transition cursor-pointer font-medium"
            >
              Officer ERP
            </button>
            <span>•</span>
            <span>All amounts in Nigerian Naira (₦)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
