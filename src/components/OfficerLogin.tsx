import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  UserCheck, 
  Building2, 
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  Briefcase
} from 'lucide-react';
import { Officer } from '../types';
import { api } from '../api';

interface OfficerLoginProps {
  onLoginSuccess: (officer: Officer, token: string) => void;
  onReturnHome: () => void;
}

export const OfficerLogin: React.FC<OfficerLoginProps> = ({ onLoginSuccess, onReturnHome }) => {
  const [identifier, setIdentifier] = useState('asaleagbara@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent, customId?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    const loginId = customId || identifier;
    const loginPass = customPass || password;

    try {
      const res = await api.loginOfficer(loginId, loginPass);
      onLoginSuccess(res.officer, res.token);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (email: string, pass: string = 'password123') => {
    setIdentifier(email);
    setPassword(pass);
    handleSubmit(undefined, email, pass);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Bar */}
      <div className="border-b border-stone-800 bg-stone-950/60 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={onReturnHome}
          className="inline-flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to AgriCore Homepage</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Officer Security Gateway • Encrypted Session</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Super Officer Access & Role Matrix */}


          {/* Right Column: Standard Login Form */}
          <div className="lg:col-span-6 flex flex-col justify-center bg-stone-950 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Officer Authentication</h3>
              <p className="text-xs text-stone-400 mt-1">
                Enter your official AgriCore staff email or Staff ID (e.g. OFF-SUPER-001)
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Official Email or Staff ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. asaleagbara@gmail.com or OFF-SUPER-001"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-sm text-white placeholder-stone-600 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Officer Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-900 border border-stone-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-sm text-white placeholder-stone-600 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-[11px] text-stone-400 mt-1 flex items-center justify-between">
                  <span>Default password for all demo accounts: <code className="text-stone-300 font-mono">password123</code></span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Officer ERP Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-stone-800/80 text-xs text-stone-400 space-y-2">
              <div className="flex items-center gap-2 text-stone-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Super Officer has unrestricted permission to create and provision officers.</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Role-based permissions dynamically filter actions across Loans, Farmers, & Silos.</span>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-800/80 text-[11px] text-stone-400 flex items-center justify-between">
                <span>AgriProduce Security Framework v2.4</span>
                <span>All sessions logged to Audit Trail</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-stone-800/80 bg-stone-950 px-4 py-3 text-center text-xs text-stone-400">
        AgriProduce Agro-Credit & Mechanization System • Federal Republic of Nigeria
      </div>
    </div>
  );
};
