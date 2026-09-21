import fs from 'fs';
import path from 'path';
import { 
  Farmer, 
  Loan, 
  InfrastructureAsset, 
  FarmerAsset, 
  AuditLog, 
  SystemStats, 
  LoanInstallment, 
  RepaymentRecord, 
  MaintenanceLog,
  Officer,
  OfficerRole,
  OfficerPermission
} from './types';

interface DatabaseSchema {
  farmers: Farmer[];
  loans: Loan[];
  infrastructure: InfrastructureAsset[];
  farmerAssets: FarmerAsset[];
  auditLogs: AuditLog[];
  officers: Officer[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'agricore_db.json');

// Initial seed data with realistic Nigerian Agricultural & Naira parameters
const SEED_FARMERS: Farmer[] = [
  {
    id: 'f-101',
    farmerCode: 'FRM-2026-001',
    fullName: 'Amara Okafor',
    nationalId: 'NIN-78491023812',
    phone: '08032194481',
    email: 'amara.okafor@agrifarm.ng',
    gender: 'Female',
    dob: '1984-05-14',
    region: 'Kaduna State',
    district: 'Giwa LGA',
    village: 'Shika Agro Hub',
    farmSizeHectares: 12.5,
    ownershipStatus: 'Owned',
    primaryCrops: ['Maize', 'Soybeans'],
    secondaryCrops: ['Cassava', 'Vegetables'],
    livestockTypes: ['Poultry (Layer Birds)'],
    soilType: 'Loamy',
    irrigationType: 'Solar Borehole',
    cooperativeName: 'Kaduna Progressive Grain Producers Union',
    bankName: 'First Bank of Nigeria',
    accountNumber: '3049182740',
    kycStatus: 'Verified',
    status: 'Active',
    creditRating: 'A+',
    pin: '1234',
    registeredAt: '2025-11-12T09:30:00Z',
    notes: 'Leader of women grain producers cluster in Giwa; 4 seasons of perfect credit track record.'
  },
  {
    id: 'f-102',
    farmerCode: 'FRM-2026-002',
    fullName: 'Ibrahim Babangida Garba',
    nationalId: 'NIN-90182471923',
    phone: '08123456789',
    email: 'ibrahim.garba@kanoagro.ng',
    gender: 'Male',
    dob: '1979-08-22',
    region: 'Kano State',
    district: 'Dambatta LGA',
    village: 'Fagwalawa Rice Plains',
    farmSizeHectares: 24.0,
    ownershipStatus: 'Owned',
    primaryCrops: ['Paddy Rice', 'Sorghum'],
    secondaryCrops: ['Watermelon', 'Tomatoes'],
    livestockTypes: ['Goats', 'Sheep'],
    soilType: 'Clay',
    irrigationType: 'Canal Gravity',
    cooperativeName: 'Hadejia-Jama’are Rice Farmers Cooperative',
    bankName: 'Zenith Bank',
    accountNumber: '1440281902',
    kycStatus: 'Verified',
    status: 'Active',
    creditRating: 'A',
    pin: '1234',
    registeredAt: '2025-12-04T11:15:00Z',
    notes: 'Supplies commercial rice mills in Kano. Successfully settled two previous input loans on time.'
  },
  {
    id: 'f-103',
    farmerCode: 'FRM-2026-003',
    fullName: 'Oluwaseun Adeleke',
    nationalId: 'NIN-33910284715',
    phone: '08055678901',
    email: 'seun.adeleke@greenfield.ng',
    gender: 'Male',
    dob: '1990-03-18',
    region: 'Ogun State',
    district: 'Obafemi Owode LGA',
    village: 'Mowe Agricultural Cluster',
    farmSizeHectares: 8.5,
    ownershipStatus: 'Owned',
    primaryCrops: ['Cassava', 'Plantain'],
    secondaryCrops: ['Maize', 'Peppers'],
    livestockTypes: ['Piggery'],
    soilType: 'Loamy',
    irrigationType: 'Drip System',
    cooperativeName: 'Ogun Farmers Multipurpose Cooperative',
    bankName: 'Access Bank',
    accountNumber: '8820194726',
    kycStatus: 'Verified',
    status: 'Active',
    creditRating: 'A',
    pin: '1234',
    registeredAt: '2026-01-10T14:20:00Z',
    notes: 'Specializes in high-yield TME 419 cassava stem multiplication and garri processing.'
  },
  {
    id: 'f-104',
    farmerCode: 'FRM-2026-004',
    fullName: 'Fatima Abubakar Sadiq',
    nationalId: 'NIN-19820491028',
    phone: '08098765432',
    email: 'fatima.sadiq@saheltomato.ng',
    gender: 'Female',
    dob: '1992-06-11',
    region: 'Plateau State',
    district: 'Barkin Ladi LGA',
    village: 'Kuru Farmlands',
    farmSizeHectares: 15.0,
    ownershipStatus: 'Leased',
    primaryCrops: ['Irish Potatoes', 'Cabbage'],
    secondaryCrops: ['Carrots', 'Green Peppers'],
    livestockTypes: ['Dairy Cattle'],
    soilType: 'Volcanic',
    irrigationType: 'Sprinkler',
    cooperativeName: 'Plateau Horticultural Producers Society',
    bankName: 'United Bank for Africa (UBA)',
    accountNumber: '0112948190',
    kycStatus: 'Verified',
    status: 'Active',
    creditRating: 'B',
    pin: '1234',
    registeredAt: '2026-01-28T08:45:00Z',
    notes: 'Exemplary cold-chain vegetable grower; expanding greenhouse cultivation.'
  },
  {
    id: 'f-105',
    farmerCode: 'FRM-2026-005',
    fullName: 'Chinedu Eze',
    nationalId: 'NIN-44810294109',
    phone: '07031234567',
    email: 'chinedu.eze@benueyam.ng',
    gender: 'Male',
    dob: '1988-11-29',
    region: 'Benue State',
    district: 'Makurdi LGA',
    village: 'Agan Agricultural Belt',
    farmSizeHectares: 6.0,
    ownershipStatus: 'Leased',
    primaryCrops: ['Yam', 'Sesame (Beniseed)'],
    secondaryCrops: ['Soybeans'],
    livestockTypes: ['Goats'],
    soilType: 'Sandy',
    irrigationType: 'Rainfed',
    cooperativeName: 'Food Basket Producers Cooperative Union',
    bankName: 'Stanbic IBTC',
    accountNumber: '0291847192',
    kycStatus: 'Pending',
    status: 'Active',
    creditRating: 'B',
    pin: '1234',
    registeredAt: '2026-02-15T13:00:00Z',
    notes: 'New member; land title verification in progress with local community council.'
  }
];

// Seed loans in Nigerian Naira (₦)
const SEED_LOANS: Loan[] = [
  {
    id: 'ln-201',
    loanCode: 'LN-2026-014',
    farmerId: 'f-101',
    farmerName: 'Amara Okafor',
    farmerPhone: '08032194481',
    farmSizeHectares: 12.5,
    purpose: 'Seed & Fertilizer',
    amountRequested: 2500000,
    amountApproved: 2500000,
    interestRate: 6.0,
    durationMonths: 6,
    repaymentFrequency: 'Monthly',
    status: 'Repaying',
    applicationDate: '2026-01-05',
    approvedDate: '2026-01-07',
    disbursedDate: '2026-01-10',
    dueDate: '2026-07-10',
    totalRepaid: 1250000,
    outstandingBalance: 1325000,
    collateralDescription: 'Pledged 15 MT Maize Warehouse Receipt #WR-4091',
    guarantorName: 'Kaduna Progressive Grain Producers Union',
    guarantorPhone: '08020001122',
    riskAssessment: 'Low Risk',
    installments: [
      { installmentNumber: 1, dueDate: '2026-02-10', amountDue: 429166, amountPaid: 429166, status: 'Paid', paidAt: '2026-02-09' },
      { installmentNumber: 2, dueDate: '2026-03-10', amountDue: 429166, amountPaid: 429166, status: 'Paid', paidAt: '2026-03-08' },
      { installmentNumber: 3, dueDate: '2026-04-10', amountDue: 429166, amountPaid: 391668, status: 'Paid', paidAt: '2026-04-09' },
      { installmentNumber: 4, dueDate: '2026-05-10', amountDue: 429166, amountPaid: 0, status: 'Pending' },
      { installmentNumber: 5, dueDate: '2026-06-10', amountDue: 429166, amountPaid: 0, status: 'Pending' },
      { installmentNumber: 6, dueDate: '2026-07-10', amountDue: 429170, amountPaid: 0, status: 'Pending' }
    ],
    repayments: [
      { id: 'rep-01', amount: 429166, paymentDate: '2026-02-09', paymentMethod: 'Bank Transfer', referenceNo: 'TXN-FB-910283', recordedBy: 'Automated Bank API', notes: 'First Bank direct deposit' },
      { id: 'rep-02', amount: 429166, paymentDate: '2026-03-08', paymentMethod: 'Mobile Money (OPay / PalmPay / MoMo)', referenceNo: 'OPAY-8839102', recordedBy: 'Kaduna Field Officer', notes: 'OPay merchant settlement' },
      { id: 'rep-03', amount: 391668, paymentDate: '2026-04-09', paymentMethod: 'Bank Transfer', referenceNo: 'TXN-FB-920194', recordedBy: 'Loan Officer', notes: 'Partial installment payment' }
    ],
    notes: 'Exemplary repayment record; certified high germination hybrid seeds delivered.'
  },
  {
    id: 'ln-202',
    loanCode: 'LN-2026-015',
    farmerId: 'f-102',
    farmerName: 'Ibrahim Babangida Garba',
    farmerPhone: '08123456789',
    farmSizeHectares: 24.0,
    purpose: 'Solar Water Pump',
    amountRequested: 3500000,
    amountApproved: 3500000,
    interestRate: 7.5,
    durationMonths: 12,
    repaymentFrequency: 'Quarterly',
    status: 'Repaying',
    applicationDate: '2025-11-20',
    approvedDate: '2025-11-25',
    disbursedDate: '2025-12-01',
    dueDate: '2026-12-01',
    totalRepaid: 940625,
    outstandingBalance: 2821875,
    collateralDescription: 'Lien on 5HP Submersible Solar Pump & Rice Mill Deed',
    guarantorName: 'Hadejia-Jama’are Rice Farmers Cooperative',
    guarantorPhone: '08033334455',
    riskAssessment: 'Low Risk',
    installments: [
      { installmentNumber: 1, dueDate: '2026-03-01', amountDue: 940625, amountPaid: 940625, status: 'Paid', paidAt: '2026-02-28' },
      { installmentNumber: 2, dueDate: '2026-06-01', amountDue: 940625, amountPaid: 0, status: 'Pending' },
      { installmentNumber: 3, dueDate: '2026-09-01', amountDue: 940625, amountPaid: 0, status: 'Pending' },
      { installmentNumber: 4, dueDate: '2026-12-01', amountDue: 940625, amountPaid: 0, status: 'Pending' }
    ],
    repayments: [
      { id: 'rep-04', amount: 940625, paymentDate: '2026-02-28', paymentMethod: 'Harvest Deduction', referenceNo: 'COOP-OFF-2026', recordedBy: 'Cooperative Accountant', notes: 'Rice paddy offtake deduction' }
    ],
    notes: 'Pump fully operational across 24 hectares of dry season paddy rice.'
  },
  {
    id: 'ln-203',
    loanCode: 'LN-2026-016',
    farmerId: 'f-103',
    farmerName: 'Oluwaseun Adeleke',
    farmerPhone: '08055678901',
    farmSizeHectares: 8.5,
    purpose: 'Tractor & Machinery',
    amountRequested: 5000000,
    amountApproved: 5000000,
    interestRate: 8.0,
    durationMonths: 24,
    repaymentFrequency: 'Seasonal Harvest',
    status: 'Approved',
    applicationDate: '2026-02-10',
    approvedDate: '2026-03-01',
    dueDate: '2028-03-01',
    totalRepaid: 0,
    outstandingBalance: 5800000,
    collateralDescription: 'Farm mechanization lien and title deed for 8.5 hectares',
    guarantorName: 'Ogun Farmers Multipurpose Cooperative',
    guarantorPhone: '08055556677',
    riskAssessment: 'Moderate Risk',
    installments: [
      { installmentNumber: 1, dueDate: '2026-09-01', amountDue: 1450000, amountPaid: 0, status: 'Pending' },
      { installmentNumber: 2, dueDate: '2027-03-01', amountDue: 1450000, amountPaid: 0, status: 'Pending' },
      { installmentNumber: 3, dueDate: '2027-09-01', amountDue: 1450000, amountPaid: 0, status: 'Pending' },
      { installmentNumber: 4, dueDate: '2028-03-01', amountDue: 1450000, amountPaid: 0, status: 'Pending' }
    ],
    repayments: [],
    notes: 'Approved by Agricultural Credit Committee; awaiting disbursement schedule.'
  },
  {
    id: 'ln-204',
    loanCode: 'LN-2026-017',
    farmerId: 'f-104',
    farmerName: 'Fatima Abubakar Sadiq',
    farmerPhone: '08098765432',
    farmSizeHectares: 15.0,
    purpose: 'Post-Harvest Storage',
    amountRequested: 1800000,
    amountApproved: 0,
    interestRate: 6.5,
    durationMonths: 6,
    repaymentFrequency: 'Monthly',
    status: 'Pending',
    applicationDate: '2026-03-10',
    dueDate: '2026-09-10',
    totalRepaid: 0,
    outstandingBalance: 0,
    collateralDescription: 'Cold hub off-take delivery contract with Plateau Supermarkets',
    guarantorName: 'Plateau Horticultural Producers Society',
    guarantorPhone: '08099990011',
    riskAssessment: 'Low Risk',
    installments: [],
    repayments: [],
    notes: 'Applied via self-service Farmer Portal. Agronomist review pending.'
  }
];

// Seed individual farmer assets in Nigerian Naira (₦)
const SEED_FARMER_ASSETS: FarmerAsset[] = [
  {
    id: 'fa-501',
    farmerId: 'f-101',
    farmerName: 'Amara Okafor',
    assetName: 'Solar Submersible Irrigation Pump 5HP',
    assetType: 'Solar Irrigation Pump',
    purchaseYear: 2024,
    condition: 'Excellent',
    estimatedValueNaira: 3200000,
    serialNumber: 'SOL-PMP-9941',
    specifications: '5HP Grundfos Solar pump with 12x 450W Canadian Solar panels and automatic dry-run sensor.',
    registeredDate: '2025-11-15'
  },
  {
    id: 'fa-502',
    farmerId: 'f-102',
    farmerName: 'Ibrahim Babangida Garba',
    assetName: 'Mahindra 575 DI Farm Tractor (45 HP)',
    assetType: 'Tractor',
    purchaseYear: 2023,
    condition: 'Good',
    estimatedValueNaira: 14500000,
    serialNumber: 'TRC-MHD-78102',
    specifications: '4-cylinder diesel engine, dual clutch, fitted with 3-disc plow and heavy-duty ridger.',
    registeredDate: '2025-12-10'
  },
  {
    id: 'fa-503',
    farmerId: 'f-103',
    farmerName: 'Oluwaseun Adeleke',
    assetName: 'Motorized Cassava Grater & Hydraulic Press',
    assetType: 'Processing Mill',
    purchaseYear: 2024,
    condition: 'Excellent',
    estimatedValueNaira: 1850000,
    serialNumber: 'CAS-GRT-2041',
    specifications: 'Stainless steel drum, 7.5HP diesel engine with 30-ton hydraulic dewatering jack.',
    registeredDate: '2026-01-15'
  },
  {
    id: 'fa-504',
    farmerId: 'f-104',
    farmerName: 'Fatima Abubakar Sadiq',
    assetName: 'Horticultural Walk-in Greenhouse (300 sqm)',
    assetType: 'Greenhouse',
    purchaseYear: 2025,
    condition: 'Excellent',
    estimatedValueNaira: 4800000,
    serialNumber: 'GH-PLT-1102',
    specifications: 'Galvanized tubular steel frame, UV-stabilized 200 micron polythene film with drip lines.',
    registeredDate: '2026-02-01'
  }
];

// Seed Community Infrastructure in Nigerian Naira (₦)
const SEED_INFRASTRUCTURE: InfrastructureAsset[] = [
  {
    id: 'inf-301',
    assetCode: 'INF-SLO-01',
    name: 'Kaduna Central Grain Silo Complex',
    category: 'Storage Silo',
    region: 'Kaduna State',
    district: 'Giwa LGA',
    gpsCoordinates: '11.2781° N, 7.4392° E',
    capacity: '2,500 Metric Tons',
    condition: 'Operational',
    utilizationPercent: 82,
    installationDate: '2024-03-15',
    estimatedValueUsd: 85000,
    estimatedValueNaira: 125000000,
    custodianType: 'Farmer Cooperative',
    custodianName: 'Kaduna Progressive Grain Producers Union',
    custodianPhone: '08031112233',
    beneficiaryFarmersCount: 380,
    lastMaintenanceDate: '2026-01-18',
    nextMaintenanceDue: '2026-07-18',
    maintenanceLogs: [
      {
        id: 'm-01',
        date: '2026-01-18',
        description: 'Aeration blower motor overhaul & moisture sensor calibration',
        cost: 650000,
        technician: 'Engr. Chidi Nwankwo',
        partsReplaced: 'Filter cartridges & 2 thermistor cables',
        status: 'Completed'
      },
      {
        id: 'm-00',
        date: '2025-07-10',
        description: 'Annual fumigation & seal integrity inspection',
        cost: 400000,
        technician: 'BioSafe Fumigations Ltd',
        status: 'Completed'
      }
    ],
    specifications: '3x Galvanized Steel Corrugated Silos with automated temperature, humidity, and weevil telematics.'
  },
  {
    id: 'inf-302',
    assetCode: 'INF-BHL-02',
    name: 'Fagwalawa Community Solar Irrigation Borehole',
    category: 'Solar Borehole',
    region: 'Kano State',
    district: 'Dambatta LGA',
    gpsCoordinates: '12.4224° N, 8.5851° E',
    capacity: '25,000 Liters / Hour',
    condition: 'Operational',
    utilizationPercent: 92,
    installationDate: '2024-08-20',
    estimatedValueUsd: 22000,
    estimatedValueNaira: 32000000,
    custodianType: 'Community Water Board',
    custodianName: 'Dambatta Water Users Association',
    custodianPhone: '08129900112',
    beneficiaryFarmersCount: 420,
    lastMaintenanceDate: '2026-02-10',
    nextMaintenanceDue: '2026-08-10',
    maintenanceLogs: [
      {
        id: 'm-02',
        date: '2026-02-10',
        description: 'Solar PV panel cleaning and MPPT charge controller firmware update',
        cost: 180000,
        technician: 'Kano Solar Solutions Ltd',
        status: 'Completed'
      }
    ],
    specifications: '15 kW Monocrystalline solar array driving Grundfos submersible pump with 60,000L elevated storage.'
  },
  {
    id: 'inf-303',
    assetCode: 'INF-CLD-03',
    name: 'Plateau High-Altitude Solar Cold Hub',
    category: 'Cold Storage Facility',
    region: 'Plateau State',
    district: 'Barkin Ladi LGA',
    gpsCoordinates: '9.5514° N, 8.8587° E',
    capacity: '40 Metric Tons',
    condition: 'Operational',
    utilizationPercent: 74,
    installationDate: '2025-02-11',
    estimatedValueUsd: 48000,
    estimatedValueNaira: 70000000,
    custodianType: 'Farmer Cooperative',
    custodianName: 'Plateau Horticultural Producers Society',
    custodianPhone: '08090091182',
    beneficiaryFarmersCount: 160,
    lastMaintenanceDate: '2026-01-05',
    nextMaintenanceDue: '2026-05-05',
    maintenanceLogs: [
      {
        id: 'm-03',
        date: '2026-01-05',
        description: 'Cooling cycle refrigerant R410A top-up and thermal insulation seal check',
        cost: 320000,
        technician: 'Jos Thermal Tech',
        partsReplaced: 'Heavy duty PVC flap curtain',
        status: 'Completed'
      }
    ],
    specifications: 'Containerized solar-powered cold room maintained at 4°C - 8°C with phase-change thermal storage.'
  },
  {
    id: 'inf-304',
    assetCode: 'INF-TRC-04',
    name: 'Ogun Agribusiness Mechanization Depot',
    category: 'Tractor / Equipment Depot',
    region: 'Ogun State',
    district: 'Obafemi Owode LGA',
    gpsCoordinates: '6.9143° N, 3.5698° E',
    capacity: '8 Tractors + 6 Implement Sets',
    condition: 'Needs Maintenance',
    utilizationPercent: 88,
    installationDate: '2023-11-01',
    estimatedValueUsd: 140000,
    estimatedValueNaira: 195000000,
    custodianType: 'Private-Public Entity',
    custodianName: 'Ogun Farm Services Hub',
    custodianPhone: '08052001992',
    beneficiaryFarmersCount: 550,
    lastMaintenanceDate: '2025-11-20',
    nextMaintenanceDue: '2026-03-25',
    maintenanceLogs: [
      {
        id: 'm-04',
        date: '2025-11-20',
        description: 'Tractor Unit #3 hydraulic steering pump seal leak repair',
        cost: 450000,
        technician: 'AgriMech Nigeria Ltd',
        status: 'Completed'
      }
    ],
    specifications: 'Centralized heavy farm machinery rental depot with maintenance bay and mobile field service team.'
  }
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-01',
    timestamp: '2026-03-14T16:10:00Z',
    action: 'REPAYMENT_RECORDED',
    category: 'LOAN',
    entityId: 'ln-201',
    entityName: 'Amara Okafor (LN-2026-014)',
    details: 'Recorded installment repayment of ₦391,668.00 via Bank Transfer.',
    performedBy: 'Ibrahim S. (Loan Officer)'
  },
  {
    id: 'aud-02',
    timestamp: '2026-03-10T11:22:00Z',
    action: 'FARMER_LOAN_SUBMITTED',
    category: 'LOAN',
    entityId: 'ln-204',
    entityName: 'Fatima Abubakar Sadiq (LN-2026-017)',
    details: 'Self-service loan request for ₦1,800,000.00 for Post-Harvest Cold Storage.',
    performedBy: 'Fatima Abubakar Sadiq (Farmer Portal)'
  },
  {
    id: 'aud-03',
    timestamp: '2026-03-01T09:40:00Z',
    action: 'LOAN_APPROVED',
    category: 'LOAN',
    entityId: 'ln-203',
    entityName: 'Oluwaseun Adeleke (LN-2026-016)',
    details: 'Credit Committee approved ₦5,000,000.00 tractor financing at 8.0% APR.',
    performedBy: 'Credit Committee'
  },
  {
    id: 'aud-04',
    timestamp: '2026-02-15T13:00:00Z',
    action: 'FARMER_REGISTERED',
    category: 'FARMER',
    entityId: 'f-105',
    entityName: 'Chinedu Eze',
    details: 'New farmer registered in Makurdi LGA, Benue State (6.0 ha). KYC pending.',
    performedBy: 'Field Officer Audu'
  }
];

export const DEFAULT_ROLE_PERMISSIONS: Record<OfficerRole, OfficerPermission[]> = {
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

const SEED_OFFICERS: Officer[] = [
  {
    id: 'off-super-01',
    staffCode: 'OFF-SUPER-001',
    fullName: 'Dr. Alade Sale-Agbara',
    email: 'asaleagbara@gmail.com',
    phone: '08023456789',
    password: 'password123',
    role: 'SUPER_OFFICER',
    roleTitle: 'Chief Executive & Super Officer',
    department: 'Executive Directorate',
    assignedRegion: 'National (All 36 States & FCT)',
    permissions: [
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
    status: 'Active',
    createdAt: '2025-01-01T08:00:00Z',
    lastLoginAt: '2026-03-21T08:30:00Z'
  },
  {
    id: 'off-super-02',
    staffCode: 'OFF-SUPER-002',
    fullName: 'AgriCore Super Admin',
    email: 'superadmin@agricore.ng',
    phone: '08033334444',
    password: 'password123',
    role: 'SUPER_OFFICER',
    roleTitle: 'Super Administrator',
    department: 'Operations & Technology',
    assignedRegion: 'National (All 36 States & FCT)',
    permissions: [
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
    status: 'Active',
    createdAt: '2025-01-05T09:00:00Z'
  },
  {
    id: 'off-crd-03',
    staffCode: 'OFF-CRD-003',
    fullName: 'Hauwa Mustapha, CIBN',
    email: 'credit.underwriting@agricore.ng',
    phone: '08044445555',
    password: 'password123',
    role: 'CREDIT_OFFICER',
    roleTitle: 'Senior Credit & Loan Underwriter',
    department: 'Agricultural Micro-Finance Division',
    assignedRegion: 'Northern Agro Belt (Kaduna, Kano)',
    permissions: [
      'manage_farmers',
      'approve_loans',
      'disburse_loans',
      'record_repayments',
      'view_audit_logs'
    ],
    status: 'Active',
    createdAt: '2025-02-10T10:00:00Z'
  },
  {
    id: 'off-fld-04',
    staffCode: 'OFF-FLD-004',
    fullName: 'Emeka Chibuike Okoye',
    email: 'field.extension@agricore.ng',
    phone: '08055556666',
    password: 'password123',
    role: 'FIELD_OFFICER',
    roleTitle: 'Agricultural Extension Officer',
    department: 'Farmer Extension Services',
    assignedRegion: 'Middle Belt & South-West (Benue, Ogun)',
    permissions: [
      'manage_farmers',
      'record_repayments'
    ],
    status: 'Active',
    createdAt: '2025-03-01T11:00:00Z'
  },
  {
    id: 'off-inf-05',
    staffCode: 'OFF-INF-005',
    fullName: 'Engr. Farouk Danladi',
    email: 'infrastructure@agricore.ng',
    phone: '08066667777',
    password: 'password123',
    role: 'INFRASTRUCTURE_OFFICER',
    roleTitle: 'Mechanization & Infrastructure Custodian',
    department: 'Machinery & Storage Logistics',
    assignedRegion: 'National Fleet Depots',
    permissions: [
      'manage_infrastructure',
      'log_maintenance',
      'view_audit_logs'
    ],
    status: 'Active',
    createdAt: '2025-03-15T12:00:00Z'
  },
  {
    id: 'off-aud-06',
    staffCode: 'OFF-AUD-006',
    fullName: 'Aisha Bello-Lawal, FCA',
    email: 'auditor@agricore.ng',
    phone: '08077778888',
    password: 'password123',
    role: 'AUDITOR',
    roleTitle: 'Senior Compliance & Risk Auditor',
    department: 'Internal Audit & Governance',
    assignedRegion: 'National',
    permissions: [
      'view_audit_logs'
    ],
    status: 'Active',
    createdAt: '2025-04-01T08:30:00Z'
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    this.ensureDirectory();
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.farmers && parsed.loans && parsed.infrastructure) {
          if (!parsed.farmerAssets) parsed.farmerAssets = SEED_FARMER_ASSETS;
          if (!parsed.officers || parsed.officers.length === 0) {
            parsed.officers = JSON.parse(JSON.stringify(SEED_OFFICERS));
          } else {
            // Ensure Dr. Alade Sale-Agbara asaleagbara@gmail.com is present as Super Officer
            const hasUser = parsed.officers.some((o: Officer) => o.email?.toLowerCase() === 'asaleagbara@gmail.com');
            if (!hasUser) {
              parsed.officers.unshift(JSON.parse(JSON.stringify(SEED_OFFICERS[0])));
            }
          }
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read existing database file, seeding defaults:', err);
    }

    const defaultData: DatabaseSchema = {
      farmers: SEED_FARMERS,
      loans: SEED_LOANS,
      infrastructure: SEED_INFRASTRUCTURE,
      farmerAssets: SEED_FARMER_ASSETS,
      auditLogs: SEED_AUDIT_LOGS,
      officers: JSON.parse(JSON.stringify(SEED_OFFICERS))
    };
    this.saveDataDirect(defaultData);
    return defaultData;
  }

  private saveDataDirect(data: DatabaseSchema) {
    this.ensureDirectory();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  private persist() {
    this.saveDataDirect(this.data);
  }

  public resetToSeed(): DatabaseSchema {
    this.data = {
      farmers: JSON.parse(JSON.stringify(SEED_FARMERS)),
      loans: JSON.parse(JSON.stringify(SEED_LOANS)),
      infrastructure: JSON.parse(JSON.stringify(SEED_INFRASTRUCTURE)),
      farmerAssets: JSON.parse(JSON.stringify(SEED_FARMER_ASSETS)),
      officers: JSON.parse(JSON.stringify(SEED_OFFICERS)),
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: new Date().toISOString(),
          action: 'SYSTEM_RESET',
          category: 'SYSTEM',
          details: 'Database restored to initial Nigerian Naira seed dataset.',
          performedBy: 'Admin Operator'
        },
        ...JSON.parse(JSON.stringify(SEED_AUDIT_LOGS))
      ]
    };
    this.persist();
    return this.data;
  }

  // --- Farmers Operations ---
  public getFarmers(filter?: { search?: string; region?: string; status?: string; kycStatus?: string }): Farmer[] {
    let result = this.data.farmers;
    if (!filter) return result;

    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(f => 
        f.fullName.toLowerCase().includes(q) ||
        f.farmerCode.toLowerCase().includes(q) ||
        f.phone.includes(q) ||
        f.nationalId.toLowerCase().includes(q) ||
        f.cooperativeName.toLowerCase().includes(q)
      );
    }
    if (filter.region && filter.region !== 'all') {
      result = result.filter(f => f.region.toLowerCase() === filter.region?.toLowerCase());
    }
    if (filter.status && filter.status !== 'all') {
      result = result.filter(f => f.status.toLowerCase() === filter.status?.toLowerCase());
    }
    if (filter.kycStatus && filter.kycStatus !== 'all') {
      result = result.filter(f => f.kycStatus.toLowerCase() === filter.kycStatus?.toLowerCase());
    }
    return result;
  }

  public getFarmerById(id: string): Farmer | undefined {
    return this.data.farmers.find(f => f.id === id);
  }

  public getFarmerByLogin(identifier: string, pin?: string): Farmer | undefined {
    const cleanId = identifier.trim().toLowerCase();
    const farmer = this.data.farmers.find(f => 
      f.phone.replace(/[\s+-]/g, '') === cleanId.replace(/[\s+-]/g, '') ||
      f.nationalId.toLowerCase() === cleanId ||
      f.farmerCode.toLowerCase() === cleanId
    );

    if (!farmer) return undefined;
    if (pin && farmer.pin && farmer.pin !== pin) {
      return undefined;
    }
    return farmer;
  }

  public createFarmer(data: Partial<Farmer>, performedBy = 'AgriCore Admin'): Farmer {
    const codeNum = (this.data.farmers.length + 1).toString().padStart(3, '0');
    const newFarmer: Farmer = {
      id: 'f-' + Date.now(),
      farmerCode: `FRM-2026-${codeNum}`,
      fullName: data.fullName || 'Unnamed Farmer',
      nationalId: data.nationalId || `NIN-${Date.now().toString().slice(-8)}`,
      phone: data.phone || '',
      email: data.email || '',
      gender: data.gender || 'Male',
      dob: data.dob || '1990-01-01',
      region: data.region || 'Kaduna State',
      district: data.district || 'Giwa LGA',
      village: data.village || 'Agro Village',
      farmSizeHectares: Number(data.farmSizeHectares) || 2.0,
      ownershipStatus: data.ownershipStatus || 'Owned',
      primaryCrops: Array.isArray(data.primaryCrops) ? data.primaryCrops : ['Maize'],
      secondaryCrops: Array.isArray(data.secondaryCrops) ? data.secondaryCrops : [],
      livestockTypes: Array.isArray(data.livestockTypes) ? data.livestockTypes : [],
      soilType: data.soilType || 'Loamy',
      irrigationType: data.irrigationType || 'Rainfed',
      cooperativeName: data.cooperativeName || 'Independent Smallholder',
      bankName: data.bankName || 'First Bank of Nigeria',
      accountNumber: data.accountNumber || '',
      kycStatus: data.kycStatus || 'Pending',
      status: data.status || 'Active',
      creditRating: data.creditRating || 'B',
      pin: data.pin || '1234',
      registeredAt: new Date().toISOString(),
      notes: data.notes || ''
    };

    this.data.farmers.unshift(newFarmer);
    this.addAuditLog({
      action: 'FARMER_REGISTERED',
      category: 'FARMER',
      entityId: newFarmer.id,
      entityName: newFarmer.fullName,
      details: `Registered ${newFarmer.fullName} (${newFarmer.farmerCode}) in ${newFarmer.district}, ${newFarmer.region}. Farm: ${newFarmer.farmSizeHectares} ha.`,
      performedBy
    });

    this.persist();
    return newFarmer;
  }

  public updateFarmer(id: string, updates: Partial<Farmer>): Farmer | undefined {
    const index = this.data.farmers.findIndex(f => f.id === id);
    if (index === -1) return undefined;

    const existing = this.data.farmers[index];
    const updated: Farmer = {
      ...existing,
      ...updates,
      id: existing.id,
      farmerCode: existing.farmerCode
    };

    this.data.farmers[index] = updated;
    this.addAuditLog({
      action: 'FARMER_UPDATED',
      category: 'FARMER',
      entityId: updated.id,
      entityName: updated.fullName,
      details: `Updated farmer profile ${updated.fullName} (${updated.farmerCode}).`,
      performedBy: 'AgriCore Officer'
    });

    this.persist();
    return updated;
  }

  public deleteFarmer(id: string): boolean {
    const index = this.data.farmers.findIndex(f => f.id === id);
    if (index === -1) return false;

    const [deleted] = this.data.farmers.splice(index, 1);
    this.addAuditLog({
      action: 'FARMER_DELETED',
      category: 'FARMER',
      entityId: deleted.id,
      entityName: deleted.fullName,
      details: `Removed farmer ${deleted.fullName} (${deleted.farmerCode}) from system.`,
      performedBy: 'AgriCore Admin'
    });

    this.persist();
    return true;
  }

  // --- Farmer Asset Uploads & Management ---
  public getFarmerAssets(farmerId?: string): FarmerAsset[] {
    if (farmerId) {
      return this.data.farmerAssets.filter(a => a.farmerId === farmerId);
    }
    return this.data.farmerAssets;
  }

  public createFarmerAsset(data: Partial<FarmerAsset>, performedBy = 'Farmer'): FarmerAsset {
    const farmer = this.getFarmerById(data.farmerId || '');
    const newAsset: FarmerAsset = {
      id: 'fa-' + Date.now(),
      farmerId: data.farmerId || '',
      farmerName: farmer?.fullName || data.farmerName || 'Farmer',
      assetName: data.assetName || 'Farm Machinery',
      assetType: data.assetType || 'Other Machinery',
      purchaseYear: Number(data.purchaseYear) || new Date().getFullYear(),
      condition: data.condition || 'Good',
      estimatedValueNaira: Number(data.estimatedValueNaira) || 500000,
      serialNumber: data.serialNumber || '',
      documentRef: data.documentRef || '',
      specifications: data.specifications || '',
      registeredDate: new Date().toISOString().split('T')[0]
    };

    this.data.farmerAssets.unshift(newAsset);
    this.addAuditLog({
      action: 'FARMER_ASSET_REGISTERED',
      category: 'INFRASTRUCTURE',
      entityId: newAsset.id,
      entityName: `${newAsset.assetName} (${newAsset.farmerName})`,
      details: `Registered asset ${newAsset.assetName} valued at ₦${newAsset.estimatedValueNaira.toLocaleString()}.`,
      performedBy
    });

    this.persist();
    return newAsset;
  }

  public deleteFarmerAsset(id: string, farmerId?: string): boolean {
    const index = this.data.farmerAssets.findIndex(a => 
      a.id === id && (!farmerId || a.farmerId === farmerId)
    );
    if (index === -1) return false;

    const [deleted] = this.data.farmerAssets.splice(index, 1);
    this.addAuditLog({
      action: 'FARMER_ASSET_DELETED',
      category: 'INFRASTRUCTURE',
      entityId: deleted.id,
      entityName: deleted.assetName,
      details: `Removed farmer asset ${deleted.assetName}.`,
      performedBy: 'AgriCore User'
    });

    this.persist();
    return true;
  }

  // --- Loans Operations ---
  public getLoans(filter?: { search?: string; status?: string; farmerId?: string }): Loan[] {
    let result = this.data.loans;
    if (!filter) return result;

    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(l => 
        l.loanCode.toLowerCase().includes(q) ||
        l.farmerName.toLowerCase().includes(q) ||
        l.purpose.toLowerCase().includes(q) ||
        l.farmerPhone.includes(q)
      );
    }
    if (filter.status && filter.status !== 'all') {
      result = result.filter(l => l.status.toLowerCase() === filter.status?.toLowerCase());
    }
    if (filter.farmerId) {
      result = result.filter(l => l.farmerId === filter.farmerId);
    }
    return result;
  }

  public getLoanById(id: string): Loan | undefined {
    return this.data.loans.find(l => l.id === id);
  }

  public createLoan(data: {
    farmerId: string;
    purpose: any;
    amountRequested: number;
    interestRate: number;
    durationMonths: number;
    repaymentFrequency: any;
    collateralDescription?: string;
    guarantorName?: string;
    guarantorPhone?: string;
    notes?: string;
  }, performedBy = 'Officer'): Loan {
    const farmer = this.getFarmerById(data.farmerId);
    if (!farmer) throw new Error('Farmer not found');

    const codeNum = (this.data.loans.length + 1).toString().padStart(3, '0');
    const loanCode = `LN-2026-${codeNum}`;

    let risk: Loan['riskAssessment'] = 'Low Risk';
    if (farmer.creditRating === 'C' || farmer.creditRating === 'Unrated') {
      risk = 'High Risk';
    } else if (farmer.creditRating === 'B' || data.amountRequested > 3000000) {
      risk = 'Moderate Risk';
    }

    const applicationDate = new Date().toISOString().split('T')[0];
    const dueObj = new Date();
    dueObj.setMonth(dueObj.getMonth() + (Number(data.durationMonths) || 6));
    const dueDate = dueObj.toISOString().split('T')[0];

    const newLoan: Loan = {
      id: 'ln-' + Date.now(),
      loanCode,
      farmerId: farmer.id,
      farmerName: farmer.fullName,
      farmerPhone: farmer.phone,
      farmSizeHectares: farmer.farmSizeHectares,
      purpose: data.purpose,
      amountRequested: Number(data.amountRequested),
      amountApproved: 0,
      interestRate: Number(data.interestRate) || 6.5,
      durationMonths: Number(data.durationMonths) || 6,
      repaymentFrequency: data.repaymentFrequency || 'Monthly',
      status: 'Pending',
      applicationDate,
      dueDate,
      totalRepaid: 0,
      outstandingBalance: 0,
      collateralDescription: data.collateralDescription || 'Harvest crop lien',
      guarantorName: data.guarantorName || farmer.cooperativeName,
      guarantorPhone: data.guarantorPhone || '',
      riskAssessment: risk,
      installments: [],
      repayments: [],
      notes: data.notes || ''
    };

    this.data.loans.unshift(newLoan);
    this.addAuditLog({
      action: 'LOAN_APPLICATION_SUBMITTED',
      category: 'LOAN',
      entityId: newLoan.id,
      entityName: `${newLoan.farmerName} (${newLoan.loanCode})`,
      details: `Submitted loan request for ₦${newLoan.amountRequested.toLocaleString()} (${newLoan.purpose}).`,
      performedBy
    });

    this.persist();
    return newLoan;
  }

  public updateLoanStatus(
    id: string, 
    status: Loan['status'], 
    amountApproved?: number, 
    notes?: string,
    performedBy = 'Credit Committee'
  ): Loan | undefined {
    const loan = this.data.loans.find(l => l.id === id);
    if (!loan) return undefined;

    loan.status = status;
    if (notes) loan.notes = notes;

    if (status === 'Approved') {
      loan.amountApproved = amountApproved || loan.amountRequested;
      loan.approvedDate = new Date().toISOString().split('T')[0];
      const totalInterest = (loan.amountApproved * (loan.interestRate / 100) * (loan.durationMonths / 12));
      loan.outstandingBalance = Number((loan.amountApproved + totalInterest).toFixed(2));
      loan.installments = this.generateInstallments(loan);
    } else if (status === 'Disbursed') {
      loan.disbursedDate = new Date().toISOString().split('T')[0];
      if (loan.installments.length === 0) {
        loan.amountApproved = loan.amountApproved || loan.amountRequested;
        const totalInterest = (loan.amountApproved * (loan.interestRate / 100) * (loan.durationMonths / 12));
        loan.outstandingBalance = Number((loan.amountApproved + totalInterest).toFixed(2));
        loan.installments = this.generateInstallments(loan);
      }
      loan.status = 'Repaying';
    } else if (status === 'Rejected') {
      loan.amountApproved = 0;
      loan.outstandingBalance = 0;
    }

    this.addAuditLog({
      action: `LOAN_STATUS_${status.toUpperCase()}`,
      category: 'LOAN',
      entityId: loan.id,
      entityName: `${loan.farmerName} (${loan.loanCode})`,
      details: `Loan status changed to ${status}. Approved Amount: ₦${loan.amountApproved.toLocaleString()}.`,
      performedBy
    });

    this.persist();
    return loan;
  }

  private generateInstallments(loan: Loan): LoanInstallment[] {
    const installments: LoanInstallment[] = [];
    let count = loan.durationMonths;
    let stepMonths = 1;

    if (loan.repaymentFrequency === 'Quarterly') {
      count = Math.max(1, Math.floor(loan.durationMonths / 3));
      stepMonths = 3;
    } else if (loan.repaymentFrequency === 'Seasonal Harvest') {
      count = Math.max(1, Math.floor(loan.durationMonths / 6));
      stepMonths = 6;
    }

    const totalToPay = loan.outstandingBalance;
    const perInstallment = Number((totalToPay / count).toFixed(2));

    for (let i = 1; i <= count; i++) {
      const d = new Date(loan.disbursedDate || loan.approvedDate || loan.applicationDate);
      d.setMonth(d.getMonth() + (i * stepMonths));
      installments.push({
        installmentNumber: i,
        dueDate: d.toISOString().split('T')[0],
        amountDue: perInstallment,
        amountPaid: 0,
        status: 'Pending'
      });
    }

    return installments;
  }

  public recordRepayment(id: string, repayment: {
    amount: number;
    paymentMethod: any;
    referenceNo: string;
    recordedBy: string;
    notes?: string;
  }): Loan | undefined {
    const loan = this.data.loans.find(l => l.id === id);
    if (!loan) return undefined;

    const repAmount = Number(repayment.amount);
    const newRecord: RepaymentRecord = {
      id: 'rep-' + Date.now(),
      amount: repAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: repayment.paymentMethod,
      referenceNo: repayment.referenceNo || `TX-${Date.now().toString().slice(-6)}`,
      recordedBy: repayment.recordedBy,
      notes: repayment.notes
    };

    loan.repayments.unshift(newRecord);
    loan.totalRepaid = Number((loan.totalRepaid + repAmount).toFixed(2));
    loan.outstandingBalance = Math.max(0, Number((loan.outstandingBalance - repAmount).toFixed(2)));

    // Allocate payment across installments
    let remainingToAllocate = repAmount;
    for (const inst of loan.installments) {
      if (remainingToAllocate <= 0) break;
      const unpaid = inst.amountDue - inst.amountPaid;
      if (unpaid > 0) {
        const payThis = Math.min(unpaid, remainingToAllocate);
        inst.amountPaid = Number((inst.amountPaid + payThis).toFixed(2));
        remainingToAllocate -= payThis;
        if (inst.amountPaid >= inst.amountDue - 0.01) {
          inst.status = 'Paid';
          inst.paidAt = newRecord.paymentDate;
        }
      }
    }

    if (loan.outstandingBalance <= 0) {
      loan.status = 'Completed';
    } else {
      loan.status = 'Repaying';
    }

    this.addAuditLog({
      action: 'REPAYMENT_RECORDED',
      category: 'LOAN',
      entityId: loan.id,
      entityName: `${loan.farmerName} (${loan.loanCode})`,
      details: `Received repayment of ₦${repAmount.toLocaleString()} via ${repayment.paymentMethod}. Remaining: ₦${loan.outstandingBalance.toLocaleString()}.`,
      performedBy: repayment.recordedBy
    });

    this.persist();
    return loan;
  }

  // --- Infrastructure Operations ---
  public getInfrastructure(filter?: { search?: string; category?: string; condition?: string }): InfrastructureAsset[] {
    let result = this.data.infrastructure;
    if (!filter) return result;

    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(i => 
        i.name.toLowerCase().includes(q) ||
        i.assetCode.toLowerCase().includes(q) ||
        i.district.toLowerCase().includes(q) ||
        i.custodianName.toLowerCase().includes(q)
      );
    }
    if (filter.category && filter.category !== 'all') {
      result = result.filter(i => i.category.toLowerCase() === filter.category?.toLowerCase());
    }
    if (filter.condition && filter.condition !== 'all') {
      result = result.filter(i => i.condition.toLowerCase() === filter.condition?.toLowerCase());
    }
    return result;
  }

  public getInfrastructureById(id: string): InfrastructureAsset | undefined {
    return this.data.infrastructure.find(i => i.id === id);
  }

  public createInfrastructure(data: Partial<InfrastructureAsset>): InfrastructureAsset {
    const codeNum = (this.data.infrastructure.length + 1).toString().padStart(2, '0');
    const assetCode = `INF-${data.category?.slice(0, 3).toUpperCase() || 'AST'}-${codeNum}`;

    const newAsset: InfrastructureAsset = {
      id: 'inf-' + Date.now(),
      assetCode,
      name: data.name || 'Unnamed Asset',
      category: data.category || 'Storage Silo',
      region: data.region || 'Kaduna State',
      district: data.district || 'Giwa LGA',
      gpsCoordinates: data.gpsCoordinates || '11.0000° N, 7.0000° E',
      capacity: data.capacity || '1,000 MT',
      condition: data.condition || 'Operational',
      utilizationPercent: Number(data.utilizationPercent) || 70,
      installationDate: data.installationDate || new Date().toISOString().split('T')[0],
      estimatedValueUsd: data.estimatedValueUsd || 25000,
      estimatedValueNaira: Number(data.estimatedValueNaira) || (Number(data.estimatedValueUsd) ? Number(data.estimatedValueUsd) * 1450 : 35000000),
      custodianType: data.custodianType || 'Farmer Cooperative',
      custodianName: data.custodianName || 'Local Cooperative Board',
      custodianPhone: data.custodianPhone || '',
      beneficiaryFarmersCount: Number(data.beneficiaryFarmersCount) || 50,
      lastMaintenanceDate: data.lastMaintenanceDate || new Date().toISOString().split('T')[0],
      nextMaintenanceDue: data.nextMaintenanceDue || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maintenanceLogs: [],
      specifications: data.specifications || ''
    };

    this.data.infrastructure.unshift(newAsset);
    this.addAuditLog({
      action: 'INFRASTRUCTURE_CREATED',
      category: 'INFRASTRUCTURE',
      entityId: newAsset.id,
      entityName: newAsset.name,
      details: `Commissioned ${newAsset.name} (${newAsset.assetCode}) in ${newAsset.district}, ${newAsset.region}. Valued at ₦${newAsset.estimatedValueNaira.toLocaleString()}.`,
      performedBy: 'Infrastructure Director'
    });

    this.persist();
    return newAsset;
  }

  public logMaintenance(assetId: string, log: Omit<MaintenanceLog, 'id'>, nextScheduledDue?: string): InfrastructureAsset | undefined {
    const asset = this.data.infrastructure.find(i => i.id === assetId);
    if (!asset) return undefined;

    const newLog: MaintenanceLog = {
      ...log,
      id: 'm-' + Date.now()
    };

    asset.maintenanceLogs.unshift(newLog);
    asset.lastMaintenanceDate = log.date;
    if (nextScheduledDue) {
      asset.nextMaintenanceDue = nextScheduledDue;
    }
    if (log.status === 'Completed' && asset.condition === 'Needs Maintenance') {
      asset.condition = 'Operational';
    }

    this.addAuditLog({
      action: 'MAINTENANCE_LOGGED',
      category: 'INFRASTRUCTURE',
      entityId: asset.id,
      entityName: asset.name,
      details: `Completed maintenance: ${log.description} (₦${log.cost.toLocaleString()}). Technician: ${log.technician}.`,
      performedBy: log.technician
    });

    this.persist();
    return asset;
  }

  public addMaintenanceLog(assetId: string, log: Omit<MaintenanceLog, 'id'>, nextScheduledDue?: string): InfrastructureAsset | undefined {
    return this.logMaintenance(assetId, log, nextScheduledDue);
  }

  public updateInfrastructure(id: string, updates: Partial<InfrastructureAsset>): InfrastructureAsset | undefined {
    const asset = this.data.infrastructure.find(i => i.id === id);
    if (!asset) return undefined;

    Object.assign(asset, updates);

    this.addAuditLog({
      action: 'INFRASTRUCTURE_UPDATED',
      category: 'INFRASTRUCTURE',
      entityId: asset.id,
      entityName: asset.name,
      details: `Updated details for asset ${asset.name} (${asset.assetCode}).`,
      performedBy: 'Infrastructure Director'
    });

    this.persist();
    return asset;
  }

  public deleteInfrastructure(id: string): boolean {
    const index = this.data.infrastructure.findIndex(i => i.id === id);
    if (index === -1) return false;

    const [deleted] = this.data.infrastructure.splice(index, 1);
    this.addAuditLog({
      action: 'INFRASTRUCTURE_DELETED',
      category: 'INFRASTRUCTURE',
      entityId: deleted.id,
      entityName: deleted.name,
      details: `Decommissioned asset ${deleted.name} (${deleted.assetCode}).`,
      performedBy: 'AgriCore Admin'
    });

    this.persist();
    return true;
  }

  // --- Audit Logs ---
  public getAuditLogs(limit = 100): AuditLog[] {
    return this.data.auditLogs.slice(0, limit);
  }

  public addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const newLog: AuditLog = {
      ...log,
      id: 'aud-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.unshift(newLog);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
  }

  // --- System Stats ---
  public getStats(): SystemStats {
    const farmers = this.data.farmers;
    const loans = this.data.loans;
    const infra = this.data.infrastructure;
    const farmerAssets = this.data.farmerAssets || [];

    const totalFarmers = farmers.length;
    const activeFarmers = farmers.filter(f => f.status === 'Active').length;
    const verifiedFarmers = farmers.filter(f => f.kycStatus === 'Verified').length;
    const totalHectaresCultivated = farmers.reduce((sum, f) => sum + (f.farmSizeHectares || 0), 0);

    const disbursedLoans = loans.filter(l => ['Disbursed', 'Repaying', 'Completed', 'Defaulted'].includes(l.status));
    const totalCapitalDisbursedNaira = disbursedLoans.reduce((sum, l) => sum + (l.amountApproved || l.amountRequested), 0);
    const totalRepaidNaira = disbursedLoans.reduce((sum, l) => sum + (l.totalRepaid || 0), 0);
    const outstandingDebtNaira = disbursedLoans.reduce((sum, l) => sum + (l.outstandingBalance || 0), 0);
    const repaymentRatePercent = totalCapitalDisbursedNaira > 0
      ? Number(((totalRepaidNaira / (totalRepaidNaira + outstandingDebtNaira)) * 100).toFixed(1))
      : 100;

    const defaultedLoansCount = loans.filter(l => l.status === 'Defaulted').length;
    const pendingLoanApplications = loans.filter(l => l.status === 'Pending').length;

    const totalInfrastructureAssets = infra.length;
    const operationalInfrastructureCount = infra.filter(i => i.condition === 'Operational').length;
    const infrastructureValueNaira = infra.reduce((sum, i) => sum + (i.estimatedValueNaira || (i.estimatedValueUsd ? i.estimatedValueUsd * 1450 : 0)), 0);

    return {
      totalFarmers,
      activeFarmers,
      verifiedFarmers,
      totalLoansDisbursed: disbursedLoans.length,
      totalCapitalDisbursedUsd: Math.round(totalCapitalDisbursedNaira / 1450),
      totalCapitalDisbursedNaira,
      totalRepaidUsd: Math.round(totalRepaidNaira / 1450),
      totalRepaidNaira,
      outstandingDebtUsd: Math.round(outstandingDebtNaira / 1450),
      outstandingDebtNaira,
      repaymentRatePercent,
      defaultedLoansCount,
      pendingLoanApplications,
      totalInfrastructureAssets,
      operationalInfrastructureCount,
      infrastructureValueUsd: Math.round(infrastructureValueNaira / 1450),
      infrastructureValueNaira,
      totalFarmerAssets: farmerAssets.length,
      totalHectaresCultivated: Number(totalHectaresCultivated.toFixed(1))
    };
  }

  // --- Officer & RBAC Operations ---
  public getOfficers(includePasswords = false): Officer[] {
    const list = this.data.officers || [];
    if (includePasswords) return list;
    return list.map(o => {
      const { password, ...safe } = o;
      return safe as Officer;
    });
  }

  public getOfficerById(id: string, includePassword = false): Officer | undefined {
    const officer = (this.data.officers || []).find(o => o.id === id);
    if (!officer) return undefined;
    if (includePassword) return officer;
    const { password, ...safe } = officer;
    return safe as Officer;
  }

  public authenticateOfficer(identifier: string, passwordAttempt: string): { officer: Officer; token: string } | null {
    const norm = identifier.trim().toLowerCase();
    const officer = (this.data.officers || []).find(o => 
      o.email.toLowerCase() === norm || o.staffCode.toLowerCase() === norm
    );

    if (!officer) return null;
    if (officer.status !== 'Active') {
      throw new Error(`Account for ${officer.fullName} is currently ${officer.status}. Please contact the Super Officer.`);
    }

    const validPassword = officer.password || 'password123';
    if (passwordAttempt !== validPassword) {
      this.addAuditLog({
        action: 'OFFICER_LOGIN_FAILED',
        category: 'SECURITY',
        entityId: officer.id,
        entityName: officer.fullName,
        details: `Failed login attempt for staff ${officer.staffCode} (${officer.email}).`,
        performedBy: 'System Security'
      });
      return null;
    }

    officer.lastLoginAt = new Date().toISOString();
    this.addAuditLog({
      action: 'OFFICER_LOGIN_SUCCESS',
      category: 'SECURITY',
      entityId: officer.id,
      entityName: officer.fullName,
      details: `Officer logged in successfully. Role: ${officer.role}, Region: ${officer.assignedRegion}.`,
      performedBy: officer.fullName
    });
    this.persist();

    const { password, ...safe } = officer;
    return {
      officer: safe as Officer,
      token: `agri_token_${officer.id}_${Date.now()}`
    };
  }

  public createOfficer(officerData: Partial<Officer> & { fullName: string; email: string; role: OfficerRole }, performedBy: string): Officer {
    if (!this.data.officers) this.data.officers = [];

    const existing = this.data.officers.find(o => o.email.toLowerCase() === officerData.email.trim().toLowerCase());
    if (existing) {
      throw new Error(`An officer with email ${officerData.email} is already registered.`);
    }

    const count = this.data.officers.length + 1;
    const prefix = officerData.role === 'SUPER_OFFICER' ? 'SUPER' : officerData.role.slice(0, 3);
    const staffCode = officerData.staffCode?.trim() || `OFF-${prefix}-${String(count).padStart(3, '0')}`;

    const defaultPerms = DEFAULT_ROLE_PERMISSIONS[officerData.role] || ['view_audit_logs'];
    const permissions = officerData.permissions && officerData.permissions.length > 0
      ? officerData.permissions
      : defaultPerms;

    const newOfficer: Officer = {
      id: `off-${Date.now()}`,
      staffCode,
      fullName: officerData.fullName.trim(),
      email: officerData.email.trim().toLowerCase(),
      phone: officerData.phone?.trim() || '08000000000',
      password: officerData.password || 'password123',
      role: officerData.role,
      roleTitle: officerData.roleTitle || (
        officerData.role === 'SUPER_OFFICER' ? 'Super Administrator' :
        officerData.role === 'CREDIT_OFFICER' ? 'Credit & Loan Underwriter' :
        officerData.role === 'FIELD_OFFICER' ? 'Extension Field Agent' :
        officerData.role === 'INFRASTRUCTURE_OFFICER' ? 'Fleet & Infrastructure Custodian' : 'Compliance & Risk Auditor'
      ),
      department: officerData.department || (
        officerData.role === 'SUPER_OFFICER' ? 'Executive Directorate' :
        officerData.role === 'CREDIT_OFFICER' ? 'Agricultural Credit Division' :
        officerData.role === 'FIELD_OFFICER' ? 'Field Extension Services' :
        officerData.role === 'INFRASTRUCTURE_OFFICER' ? 'Mechanization & Logistics' : 'Internal Audit'
      ),
      assignedRegion: officerData.assignedRegion || 'National (All Regions)',
      permissions,
      status: officerData.status || 'Active',
      createdAt: new Date().toISOString()
    };

    this.data.officers.push(newOfficer);

    this.addAuditLog({
      action: 'OFFICER_CREATED',
      category: 'OFFICER',
      entityId: newOfficer.id,
      entityName: newOfficer.fullName,
      details: `Created new officer profile (${newOfficer.staffCode}) with role ${newOfficer.role} and ${permissions.length} granted permissions.`,
      performedBy: performedBy || 'Super Officer'
    });

    this.persist();
    const { password, ...safe } = newOfficer;
    return safe as Officer;
  }

  public updateOfficer(id: string, updates: Partial<Officer>, performedBy: string): Officer {
    const officer = (this.data.officers || []).find(o => o.id === id);
    if (!officer) {
      throw new Error(`Officer with ID ${id} not found.`);
    }

    if (updates.role && updates.role !== officer.role && !updates.permissions) {
      updates.permissions = DEFAULT_ROLE_PERMISSIONS[updates.role];
    }

    Object.assign(officer, updates);

    this.addAuditLog({
      action: 'OFFICER_UPDATED',
      category: 'OFFICER',
      entityId: officer.id,
      entityName: officer.fullName,
      details: `Updated officer ${officer.fullName} (${officer.staffCode}). Role: ${officer.role}, Status: ${officer.status}.`,
      performedBy: performedBy || 'Super Officer'
    });

    this.persist();
    const { password, ...safe } = officer;
    return safe as Officer;
  }

  public deleteOfficer(id: string, performedBy: string): boolean {
    const index = (this.data.officers || []).findIndex(o => o.id === id);
    if (index === -1) return false;

    const officer = this.data.officers[index];

    if (officer.role === 'SUPER_OFFICER') {
      const superCount = this.data.officers.filter(o => o.role === 'SUPER_OFFICER').length;
      if (superCount <= 1) {
        throw new Error('Cannot delete the only remaining Super Officer in the system.');
      }
    }

    this.data.officers.splice(index, 1);

    this.addAuditLog({
      action: 'OFFICER_DELETED',
      category: 'OFFICER',
      entityId: id,
      entityName: officer.fullName,
      details: `Deleted officer profile ${officer.fullName} (${officer.staffCode}).`,
      performedBy: performedBy || 'Super Officer'
    });

    this.persist();
    return true;
  }

  public getRawDatabase(): DatabaseSchema {
    return this.data;
  }
}

export const db = new Database();
