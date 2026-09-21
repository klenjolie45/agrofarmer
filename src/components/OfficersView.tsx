import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Key, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';
import { Officer, OfficerRole, OfficerPermission } from '../types';

interface OfficersViewProps {
  officers: Officer[];
  currentOfficer: Officer | null;
  onOpenCreateOfficer: () => void;
  onEditOfficer: (officer: Officer) => void;
  onToggleStatus: (officer: Officer) => void;
  onDeleteOfficer: (officerId: string) => void;
}

export const OfficersView: React.FC<OfficersViewProps> = ({
  officers,
  currentOfficer,
  onOpenCreateOfficer,
  onEditOfficer,
  onToggleStatus,
  onDeleteOfficer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showMatrixGuide, setShowMatrixGuide] = useState(false);

  const canManageOfficers = currentOfficer?.role === 'SUPER_OFFICER' || 
    (currentOfficer?.permissions && currentOfficer.permissions.includes('manage_officers'));

  // Filter officers
  const filteredOfficers = officers.filter(officer => {
    const matchesSearch = 
      officer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.staffCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.assignedRegion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'all' || officer.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || officer.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: OfficerRole) => {
    switch (role) {
      case 'SUPER_OFFICER':
        return {
          label: 'Super Officer (Root)',
          bg: 'bg-purple-100 text-purple-800 border-purple-300',
          dot: 'bg-purple-600'
        };
      case 'CREDIT_OFFICER':
        return {
          label: 'Credit Underwriter',
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          dot: 'bg-blue-600'
        };
      case 'FIELD_OFFICER':
        return {
          label: 'Field Extension Agent',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-600'
        };
      case 'INFRASTRUCTURE_OFFICER':
        return {
          label: 'Fleet & Silo Manager',
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-600'
        };
      case 'AUDITOR':
        return {
          label: 'Compliance Auditor',
          bg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
          dot: 'bg-cyan-600'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Role-Based Access Control (RBAC) Architecture</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Officer Directory & Permission Governance
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl leading-relaxed">
            Manage administrative personnel across Nigeria’s agricultural zones. Configure specific privileges for loan underwriting, farmer KYC approvals, and machinery fleet logistics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowMatrixGuide(!showMatrixGuide)}
            className="px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer"
          >
            {showMatrixGuide ? 'Hide Matrix' : 'View Permissions Matrix'}
          </button>

          {canManageOfficers && (
            <button
              onClick={onOpenCreateOfficer}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New Officer</span>
            </button>
          )}
        </div>
      </div>

      {/* Permission Matrix Drawer / Info Box */}
      {showMatrixGuide && (
        <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800 shadow-lg space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">System Roles & Operational Privileges Matrix</h3>
            </div>
            <span className="text-[11px] text-stone-400">Strictly Enforced Across All ERP Views</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-stone-800/80 border border-purple-500/30 space-y-2">
              <div className="font-bold text-purple-300">Super Officer</div>
              <p className="text-[11px] text-stone-300">
                Full root authority. Can create and modify officers, assign permissions, approve loans of any scale, and reset systems.
              </p>
              <div className="text-[10px] text-purple-400 font-mono">ALL 9 PERMISSIONS</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-800/80 border border-blue-500/30 space-y-2">
              <div className="font-bold text-blue-300">Credit Underwriter</div>
              <p className="text-[11px] text-stone-300">
                Credit committee appraisal, evaluates farmer credit scores, approves/disburses credit, and logs repayments.
              </p>
              <div className="text-[10px] text-blue-400 font-mono">5 LOAN & KYC PERMS</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-800/80 border border-emerald-500/30 space-y-2">
              <div className="font-bold text-emerald-300">Field Extension Officer</div>
              <p className="text-[11px] text-stone-300">
                Onboards smallholder farmers, verifies farm GPS & crops, submits loan requests on behalf of farmers, and records harvest collections.
              </p>
              <div className="text-[10px] text-emerald-400 font-mono">2 FIELD PERMS</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-800/80 border border-amber-500/30 space-y-2">
              <div className="font-bold text-amber-300">Fleet & Silo Custodian</div>
              <p className="text-[11px] text-stone-300">
                Registers communal silos and tractor hubs, logs maintenance work orders, and updates machinery condition.
              </p>
              <div className="text-[10px] text-amber-400 font-mono">3 ASSET PERMS</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-800/80 border border-cyan-500/30 space-y-2">
              <div className="font-bold text-cyan-300">Compliance Auditor</div>
              <p className="text-[11px] text-stone-300">
                Read-only inspection rights across audit logs, capital disbursements, and risk governance records.
              </p>
              <div className="text-[10px] text-cyan-400 font-mono">1 AUDIT PERM</div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block">Total Staff</span>
          <div className="text-xl font-bold text-stone-900 mt-1">{officers.length}</div>
          <span className="text-[10px] text-stone-400">Registered Personnel</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-purple-700 block">Super Officers</span>
          <div className="text-xl font-bold text-purple-900 mt-1">
            {officers.filter(o => o.role === 'SUPER_OFFICER').length}
          </div>
          <span className="text-[10px] text-stone-400">Root Administrators</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-blue-700 block">Credit Officers</span>
          <div className="text-xl font-bold text-blue-900 mt-1">
            {officers.filter(o => o.role === 'CREDIT_OFFICER').length}
          </div>
          <span className="text-[10px] text-stone-400">Loan Underwriters</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-700 block">Field Agents</span>
          <div className="text-xl font-bold text-emerald-900 mt-1">
            {officers.filter(o => o.role === 'FIELD_OFFICER').length}
          </div>
          <span className="text-[10px] text-stone-400">Extension Services</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 block">Active Status</span>
          <div className="text-xl font-bold text-emerald-800 mt-1">
            {officers.filter(o => o.status === 'Active').length}
          </div>
          <span className="text-[10px] text-stone-400">Permitted Access</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or staff ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-1 text-xs text-stone-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Role:</span>
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg bg-white outline-none focus:border-emerald-600"
          >
            <option value="all">All System Roles</option>
            <option value="SUPER_OFFICER">Super Officer</option>
            <option value="CREDIT_OFFICER">Credit Underwriter</option>
            <option value="FIELD_OFFICER">Field Extension Agent</option>
            <option value="INFRASTRUCTURE_OFFICER">Fleet & Asset Custodian</option>
            <option value="AUDITOR">Compliance Auditor</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg bg-white outline-none focus:border-emerald-600"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Officers List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOfficers.map((officer) => {
          const badge = getRoleBadge(officer.role);
          const isCurrentUser = currentOfficer?.id === officer.id || currentOfficer?.email === officer.email;

          return (
            <div
              key={officer.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                isCurrentUser ? 'border-emerald-500 ring-1 ring-emerald-400/40' : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-700 text-sm">
                      {officer.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-stone-900 text-sm">{officer.fullName}</h4>
                        {isCurrentUser && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                            You
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-stone-500">{officer.staffCode}</span>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                    {badge.label}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{officer.roleTitle} • {officer.department}</span>
                  </div>

                  <div className="flex items-center gap-2 text-stone-600">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{officer.assignedRegion}</span>
                  </div>

                  <div className="flex items-center gap-2 text-stone-600">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{officer.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{officer.phone || '08000000000'}</span>
                  </div>
                </div>

                {/* Granted permissions pill */}
                <div className="pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-semibold text-stone-600">Granted Permissions:</span>
                    <span className="font-mono text-emerald-800 font-bold">{officer.permissions?.length || 0} active</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(officer.permissions || []).slice(0, 4).map((p) => (
                      <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                        {p.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {(officer.permissions?.length || 0) > 4 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                        +{officer.permissions.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer: Status & Actions */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => canManageOfficers && onToggleStatus(officer)}
                  disabled={!canManageOfficers || isCurrentUser}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                    officer.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  } ${(!canManageOfficers || isCurrentUser) ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {officer.status === 'Active' ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-600" />
                  )}
                  <span>{officer.status}</span>
                </button>

                {canManageOfficers && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditOfficer(officer)}
                      className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                      title="Edit Officer & Permissions"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {!isCurrentUser && officer.role !== 'SUPER_OFFICER' && (
                      <button
                        onClick={() => onDeleteOfficer(officer.id)}
                        className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Delete Officer Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredOfficers.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-400">
            <Users className="w-8 h-8 mx-auto mb-2 text-stone-300" />
            <p className="text-sm font-medium text-stone-600">No officers found matching your search or filters.</p>
            <p className="text-xs text-stone-400 mt-1">Try clearing your filters or create a new officer.</p>
          </div>
        )}
      </div>
    </div>
  );
};
