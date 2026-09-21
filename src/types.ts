export interface FarmerAsset {
  id: string;
  farmerId: string;
  farmerName?: string;
  assetName: string;
  assetType: 'Tractor' | 'Solar Irrigation Pump' | 'Harvester' | 'Storage Silo / Crib' | 'Greenhouse' | 'Processing Mill' | 'Sprayer / Implement' | 'Power Tiller / Rotavator' | 'Other Machinery';
  purchaseYear: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Needs Repair';
  estimatedValueNaira: number;
  serialNumber?: string;
  documentRef?: string;
  specifications?: string;
  registeredDate: string;
}

export interface Farmer {
  id: string;
  farmerCode: string;
  fullName: string;
  nationalId: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  region: string;
  district: string;
  village: string;
  farmSizeHectares: number;
  ownershipStatus: 'Owned' | 'Leased' | 'Communal' | 'Cooperative';
  primaryCrops: string[];
  secondaryCrops: string[];
  livestockTypes: string[];
  soilType: 'Loamy' | 'Sandy' | 'Clay' | 'Silt' | 'Peat' | 'Volcanic';
  irrigationType: 'Rainfed' | 'Solar Borehole' | 'Canal Gravity' | 'Drip System' | 'Sprinkler';
  cooperativeName: string;
  bankName: string;
  accountNumber: string;
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
  status: 'Active' | 'Inactive' | 'Suspended';
  creditRating: 'A+' | 'A' | 'B' | 'C' | 'Unrated';
  registeredAt: string;
  pin?: string;
  notes?: string;
  loans?: Loan[];
  assets?: FarmerAsset[];
}

export interface LoanInstallment {
  installmentNumber: number;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidAt?: string;
}

export interface RepaymentRecord {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'Mobile Money (OPay / PalmPay / MoMo)' | 'Bank Transfer' | 'Cash / Agent' | 'Harvest Deduction';
  referenceNo: string;
  recordedBy: string;
  notes?: string;
}

export interface Loan {
  id: string;
  loanCode: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmSizeHectares: number;
  purpose: 'Seed & Fertilizer' | 'Irrigation Equipment' | 'Solar Water Pump' | 'Tractor & Machinery' | 'Post-Harvest Storage' | 'Livestock Feed & Care';
  amountRequested: number;
  amountApproved: number;
  interestRate: number;
  durationMonths: number;
  repaymentFrequency: 'Monthly' | 'Seasonal Harvest' | 'Quarterly';
  status: 'Pending' | 'Approved' | 'Disbursed' | 'Repaying' | 'Completed' | 'Defaulted' | 'Rejected';
  applicationDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  dueDate: string;
  totalRepaid: number;
  outstandingBalance: number;
  collateralDescription: string;
  guarantorName: string;
  guarantorPhone: string;
  riskAssessment: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  installments: LoanInstallment[];
  repayments: RepaymentRecord[];
  notes?: string;
}

export interface MaintenanceLog {
  id: string;
  date: string;
  description: string;
  cost: number;
  technician: string;
  partsReplaced?: string;
  status: 'Completed' | 'Scheduled' | 'Requires Follow-up';
}

export interface InfrastructureAsset {
  id: string;
  assetCode: string;
  name: string;
  category: 'Storage Silo' | 'Solar Borehole' | 'Irrigation Network' | 'Cold Storage Facility' | 'Processing Plant' | 'Tractor / Equipment Depot' | 'Greenhouse Hub';
  region: string;
  district: string;
  gpsCoordinates: string;
  capacity: string;
  condition: 'Operational' | 'Needs Maintenance' | 'Critical Repair' | 'Under Construction';
  utilizationPercent: number;
  installationDate: string;
  estimatedValueUsd?: number;
  estimatedValueNaira: number;
  custodianType: 'Farmer Cooperative' | 'Community Water Board' | 'Municipal District' | 'Private-Public Entity';
  custodianName: string;
  custodianPhone: string;
  beneficiaryFarmersCount: number;
  lastMaintenanceDate: string;
  nextMaintenanceDue: string;
  maintenanceLogs: MaintenanceLog[];
  specifications?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  category: 'FARMER' | 'LOAN' | 'INFRASTRUCTURE' | 'SYSTEM' | 'OFFICER' | 'SECURITY';
  entityId?: string;
  entityName?: string;
  details: string;
  performedBy: string;
}

export type OfficerRole = 
  | 'SUPER_OFFICER' 
  | 'CREDIT_OFFICER' 
  | 'FIELD_OFFICER' 
  | 'INFRASTRUCTURE_OFFICER' 
  | 'AUDITOR';

export type OfficerPermission =
  | 'manage_officers'
  | 'manage_farmers'
  | 'delete_farmers'
  | 'approve_loans'
  | 'disburse_loans'
  | 'record_repayments'
  | 'manage_infrastructure'
  | 'log_maintenance'
  | 'view_audit_logs';

export interface Officer {
  id: string;
  staffCode: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: OfficerRole;
  roleTitle: string;
  department: string;
  assignedRegion: string;
  permissions: OfficerPermission[];
  status: 'Active' | 'Suspended';
  createdAt: string;
  lastLoginAt?: string;
  avatarUrl?: string;
}

export interface SystemStats {
  totalFarmers: number;
  activeFarmers: number;
  verifiedFarmers: number;
  totalLoansDisbursed: number;
  totalCapitalDisbursedUsd?: number;
  totalCapitalDisbursedNaira: number;
  totalRepaidUsd?: number;
  totalRepaidNaira: number;
  outstandingDebtUsd?: number;
  outstandingDebtNaira: number;
  repaymentRatePercent: number;
  defaultedLoansCount: number;
  pendingLoanApplications: number;
  totalInfrastructureAssets: number;
  operationalInfrastructureCount: number;
  infrastructureValueUsd?: number;
  infrastructureValueNaira: number;
  totalFarmerAssets?: number;
  totalHectaresCultivated: number;
}

export interface AnalyticsData {
  summary: SystemStats;
  analytics: {
    regionalDistribution: Record<string, number>;
    cropCounts: Record<string, number>;
    loansByPurpose: Record<string, { count: number; totalAmount: number }>;
    infraConditions: Record<string, number>;
  };
}

export type SystemSummary = AnalyticsData;
