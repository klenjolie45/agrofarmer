import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, UserCheck, Lock, Mail, Phone, MapPin, Building, Key, Check, Info } from 'lucide-react';
import { Officer, OfficerRole, OfficerPermission } from '../types';

interface OfficerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (officerData: Partial<Officer>) => Promise<void>;
  editingOfficer?: Officer | null;
  currentOfficer: Officer | null;
}

const ALL_PERMISSIONS: { id: OfficerPermission; label: string; description: string }[] = [
  { 
    id: 'manage_officers', 
    label: 'Manage Officers & RBAC', 
    description: 'Create, update, and manage officer accounts and permissions' 
  },
  { 
    id: 'manage_farmers', 
    label: 'Register & Edit Farmers', 
    description: 'Create and update farmer profiles, farms, and KYC status' 
  },
  { 
    id: 'delete_farmers', 
    label: 'Delete Farmer Profiles', 
    description: 'Permanently remove farmer accounts and historical data' 
  },
  { 
    id: 'approve_loans', 
    label: 'Credit Committee Loan Approval', 
    description: 'Underwrite, approve, or reject loan applications' 
  },
  { 
    id: 'disburse_loans', 
    label: 'Loan Capital Disbursement', 
    description: 'Execute fund transfers and change loan status to Disbursed' 
  },
  { 
    id: 'record_repayments', 
    label: 'Record Loan Repayments', 
    description: 'Log cash, mobile money, and bank transfer repayments' 
  },
  { 
    id: 'manage_infrastructure', 
    label: 'Manage Infrastructure Assets', 
    description: 'Add and configure community grain silos, boreholes, and tractors' 
  },
  { 
    id: 'log_maintenance', 
    label: 'Schedule & Log Asset Maintenance', 
    description: 'Record servicing logs, repairs, and condition reports' 
  },
  { 
    id: 'view_audit_logs', 
    label: 'View System Audit Logs', 
    description: 'Inspect security events, chronological changes, and compliance logs' 
  }
];

const DEFAULT_ROLE_PERMS: Record<OfficerRole, OfficerPermission[]> = {
  SUPER_OFFICER: [
    'manage_officers',
    'manage_farmers',
    'delete_farmers',
    'approve_loans',
    'disburse_loans',
    'record_repayments',
    'manage_infrastructure',
    'log_maintenance',
    'view_audit_logs'
  ],
  CREDIT_OFFICER: [
    'manage_farmers',
    'approve_loans',
    'disburse_loans',
    'record_repayments',
    'view_audit_logs'
  ],
  FIELD_OFFICER: [
    'manage_farmers',
    'record_repayments'
  ],
  INFRASTRUCTURE_OFFICER: [
    'manage_infrastructure',
    'log_maintenance',
    'view_audit_logs'
  ],
  AUDITOR: [
    'view_audit_logs'
  ]
};

const NIGERIAN_REGIONS = [
  'National (All 36 States & FCT)',
  'Kaduna State',
  'Kano State',
  'Ogun State',
  'Plateau State',
  'Benue State',
  'Niger State',
  'Oyo State',
  'Taraba State',
  'Kebbi State',
  'Cross River State',
  'Edo State'
];

export const OfficerModal: React.FC<OfficerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingOfficer,
  currentOfficer
}) => {
  const [fullName, setFullName] = useState('');
  const [staffCode, setStaffCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<OfficerRole>('FIELD_OFFICER');
  const [roleTitle, setRoleTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [assignedRegion, setAssignedRegion] = useState('National (All 36 States & FCT)');
  const [status, setStatus] = useState<'Active' | 'Suspended'>('Active');
  const [selectedPermissions, setSelectedPermissions] = useState<OfficerPermission[]>(DEFAULT_ROLE_PERMS.FIELD_OFFICER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingOfficer) {
      setFullName(editingOfficer.fullName);
      setStaffCode(editingOfficer.staffCode);
      setEmail(editingOfficer.email);
      setPhone(editingOfficer.phone);
      setPassword(''); // keep blank if not changing
      setRole(editingOfficer.role);
      setRoleTitle(editingOfficer.roleTitle);
      setDepartment(editingOfficer.department);
      setAssignedRegion(editingOfficer.assignedRegion);
      setStatus(editingOfficer.status);
      setSelectedPermissions(editingOfficer.permissions || DEFAULT_ROLE_PERMS[editingOfficer.role]);
    } else {
      // Reset for new creation
      setFullName('');
      setStaffCode(`OFF-${Math.floor(100 + Math.random() * 900)}`);
      setEmail('');
      setPhone('080');
      setPassword('password123');
      setRole('FIELD_OFFICER');
      setRoleTitle('Extension Field Officer');
      setDepartment('Field Extension Services');
      setAssignedRegion('Kaduna State');
      setStatus('Active');
      setSelectedPermissions(DEFAULT_ROLE_PERMS.FIELD_OFFICER);
    }
    setError(null);
  }, [editingOfficer, isOpen]);

  const handleRoleChange = (newRole: OfficerRole) => {
    setRole(newRole);
    // Auto-fill suggested title & department
    if (newRole === 'SUPER_OFFICER') {
      setRoleTitle('Super Administrator');
      setDepartment('Executive Directorate');
      setAssignedRegion('National (All 36 States & FCT)');
    } else if (newRole === 'CREDIT_OFFICER') {
      setRoleTitle('Credit & Loan Underwriter');
      setDepartment('Agricultural Credit Division');
    } else if (newRole === 'FIELD_OFFICER') {
      setRoleTitle('Extension Field Agent');
      setDepartment('Field Extension Services');
    } else if (newRole === 'INFRASTRUCTURE_OFFICER') {
      setRoleTitle('Fleet & Asset Manager');
      setDepartment('Machinery & Logistics');
    } else if (newRole === 'AUDITOR') {
      setRoleTitle('Compliance & Risk Auditor');
      setDepartment('Internal Audit & Governance');
    }
    setSelectedPermissions(DEFAULT_ROLE_PERMS[newRole]);
  };

  const togglePermission = (perm: OfficerPermission) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== perm));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload: Partial<Officer> = {
        fullName,
        staffCode: staffCode.trim() || undefined,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        role,
        roleTitle,
        department,
        assignedRegion,
        status,
        permissions: selectedPermissions,
      };

      if (password) {
        payload.password = password;
      }

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save officer details');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {editingOfficer ? `Edit Officer: ${editingOfficer.fullName}` : 'Provision New Officer (RBAC)'}
              </h3>
              <p className="text-xs text-emerald-200">
                Define role, operational department, regional territory, and access privileges.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <Info className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Identity */}
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>1. Officer Profile & Identification</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Engr. Babatunde Sanusi"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Staff Identification Code
                </label>
                <input
                  type="text"
                  value={staffCode}
                  onChange={(e) => setStaffCode(e.target.value)}
                  placeholder="e.g. OFF-CRD-008"
                  className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none bg-stone-50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Official Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. b.sanusi@agricore.ng"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Phone Number (Official Contact)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 08031234567"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Role, Department & Jurisdiction */}
          <div className="pt-2 border-t border-stone-200">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-emerald-700" />
              <span>2. Role Assignment & Jurisdiction</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  System Role (Access Profile) <span className="text-red-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value as OfficerRole)}
                  className="w-full px-3 py-2 text-xs font-medium border border-stone-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                >
                  <option value="SUPER_OFFICER">Super Officer (Executive Full Root Access)</option>
                  <option value="CREDIT_OFFICER">Credit & Loan Underwriter</option>
                  <option value="FIELD_OFFICER">Extension Field Officer</option>
                  <option value="INFRASTRUCTURE_OFFICER">Fleet & Infrastructure Asset Manager</option>
                  <option value="AUDITOR">Compliance & Risk Auditor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Assigned Region / State Jurisdiction
                </label>
                <select
                  value={assignedRegion}
                  onChange={(e) => setAssignedRegion(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                >
                  {NIGERIAN_REGIONS.map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Agricultural Credit Division"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Official Title
                </label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Senior Agricultural Underwriter"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Account Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Active' | 'Suspended')}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                >
                  <option value="Active">Active (Permitted to Log In)</option>
                  <option value="Suspended">Suspended (Access Revoked)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {editingOfficer ? 'New Password (leave empty to keep current)' : 'Initial Password'}
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. password123"
                  className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Fine-grained Role Permissions Matrix */}
          <div className="pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-4 h-4 text-emerald-700" />
                <span>3. Granular Permission Matrix ({selectedPermissions.length} Granted)</span>
              </h4>
              <button
                type="button"
                onClick={() => setSelectedPermissions(DEFAULT_ROLE_PERMS[role])}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer underline"
              >
                Reset to Role Defaults
              </button>
            </div>
            
            <p className="text-xs text-stone-500 mb-3">
              Super Officers can fine-tune specific actions allowed for this staff member.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-stone-50 p-3 rounded-xl border border-stone-200">
              {ALL_PERMISSIONS.map((perm) => {
                const isChecked = selectedPermissions.includes(perm.id);
                return (
                  <label
                    key={perm.id}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition ${
                      isChecked 
                        ? 'bg-emerald-50/80 border-emerald-300 text-stone-900' 
                        : 'bg-white border-stone-200 text-stone-500 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => togglePermission(perm.id)}
                      className="mt-0.5 rounded border-stone-300 text-emerald-700 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="text-xs leading-tight">
                      <span className="font-semibold block text-stone-800">{perm.label}</span>
                      <span className="text-[10px] text-stone-500">{perm.description}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving Officer...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editingOfficer ? 'Update Officer Profile' : 'Create Officer Account'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
