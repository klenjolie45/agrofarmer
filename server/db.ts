import fs from 'fs';
import path from 'path';
import { 
  Farmer, 
  Loan, 
  InfrastructureAsset, 
  AuditLog, 
  SystemStats,
  LoanInstallment,
  RepaymentRecord,
  MaintenanceLog
} from './types';

interface DatabaseSchema {
  farmers: Farmer[];
  loans: Loan[];
  infrastructure: InfrastructureAsset[];
  auditLogs: AuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'agricore_db.json');

// Initial seed data with realistic agricultural parameters
const SEED_FARMERS: Farmer[] = [
  {
    id: 'f-101',
    farmerCode: 'FRM-2026-001',
    fullName: 'Amara Okafor',
    nationalId: 'NIN-78491023',
    phone: '+234 803 219 4481',
    email: 'amara.okafor@agrifarm.org',
    gender: 'Female',
    dob: '1984-05-14',
    region: 'Eastern Highlands',
    district: 'Orlu Agro Valley',
    village: 'Umuna Green Zone',
    farmSizeHectares: 12.5,
    ownershipStatus: 'Owned',
    primaryCrops: ['Maize', 'Soybeans'],
    secondaryCrops: ['Cassava', 'Vegetables'],
    livestockTypes: ['Poultry (Layer Birds)'],
    soilType: 'Loamy',
    irrigationType: 'Solar Borehole',
    cooperativeName: 'Umunna Progressive Agricultural Coop',
    bankName: 'First Agricultural Bank',
    accountNumber: '3049182740',
    kycStatus: 'Verified',
    status: 'Active',
    creditRating: 'A+',
    registeredAt: '2025-11-12T09:30:00Z',
    notes: 'Leader of women grain producers cluster; high yield consistency for 4 consecutive seasons.'
  },
  {
    id: 'f-102',
    farmerCode: 'FRM-2026-002',
    fullName: 'Kwame Mensah',
    nationalId: 'GH-90182471',
    phone: '+233 24 819 0234',
    email: 'kwame.mensah@harvestnet.com',
    gender: 'Male',
    dob: '1979-08-22',
    region: 'Volta Plains',
    district: 'Keta Agricultural District',
    village: 'Afife Rice Belt',
    farmSizeHectares: 24.0,
    ownershipStatus: 'Owned',
    primaryCrops: ['Paddy Rice', 'Sorghum'],
    secondaryCrops: ['Watermelon'],
    livestockTypes: ['Goats', 'Sheep'],
    soilType: 'Clay',
    irrigationType: 'Canal Gravity',
    cooperativeName: 'Volta Basin Rice Farmers Union',
    bankName: 'EcoBank Agricultural Fund',
    accountNumber: '1440281902',
    kycStatus: 'Verified',
    status: 'Active',
    creditRating: 'A',
    registeredAt: '2025-12-04T11:15:00Z',
    notes: 'Supplies rice to state food buffer stock. Successfully repaid two previous input credit cycles.'
  },
  {
    id: 'f-103',
    farmerCode: 'FRM-2026-003',
    fullName: 'Fatima Zahra Diallo',
    nationalId: 'SN-33910284',
    phone: '+221 77 654 8812',
    email: 'fatima.diallo@sahelgrow.org',
    gender: 'Female',
    dob: '1992-02-18',
    region: 'Northern River Basin',
    district: 'Podor Agro Zone',
    village: 'Dagana North',
    farmSizeHectares: 8.2,
    ownershipStatus: 'Cooperative',
    primaryCrops: ['Tomatoes', 'Onions'],
    secondaryCrops: ['Okra', 'Sweet Potatoes'],
    livestockTypes: [],
    soilType: 'Loamy',
    irrigationType: 'Drip System',
    cooperativeName: 'Podor Women Horticultural Association',
    bankName: 'Banque Agricole',
    accountNumber: '8820194726',
    kycStatus: 'Verified',
    status: 'Active',
    creditRating: 'A',
    registeredAt: '2026-01-10T14:20:00Z',
    notes: 'Specializes in solar cold chain export horticulture.'
  },
  {
    id: 'f-104',
    farmerCode: 'FRM-2026-004',
    fullName: 'David Kiprono',
    nationalId: 'KE-19820491',
    phone: '+254 712 849 019',
    email: 'kiprono.farms@riftvalley.co',
    gender: 'Male',
    dob: '1987-11-03',
    region: 'Central Rift Highlands',
    district: 'Eldoret Grain Corridor',
    village: 'Moiben Farmlands',
    farmSizeHectares: 35.0,
    ownershipStatus: 'Owned',
    primaryCrops: ['Wheat', 'Maize'],
    secondaryCrops: ['Barley', 'Sunflower'],
    livestockTypes: ['Dairy Cattle (Friesian)'],
    soilType: 'Volcanic',
    irrigationType: 'Rainfed',
    cooperativeName: 'Eldoret Cereal Growers Society',
    bankName: 'Cooperative Bank of Agriculture',
    accountNumber: '0112948190',
    kycStatus: 'Verified',
    status: 'Active',
    creditRating: 'B',
    registeredAt: '2026-01-28T08:45:00Z',
    notes: 'Large mechanized farm; applying for harvester machinery financing.'
  },
  {
    id: 'f-105',
    farmerCode: 'FRM-2026-005',
    fullName: 'Grace Mutua',
    nationalId: 'KE-44810294',
    phone: '+254 722 401 983',
    email: 'grace.mutua@eastagro.com',
    gender: 'Female',
    dob: '1995-07-29',
    region: 'Eastern Semi-Arid',
    district: 'Machakos Drylands',
    village: 'Masii Valley',
    farmSizeHectares: 6.0,
    ownershipStatus: 'Leased',
    primaryCrops: ['Green Grams', 'Sorghum'],
    secondaryCrops: ['Cowpeas', 'Mangoes'],
    livestockTypes: ['Indigenous Poultry'],
    soilType: 'Sandy',
    irrigationType: 'Sprinkler',
    cooperativeName: 'Masii Drought Resilient Growers',
    bankName: 'Equity Agribusiness Fund',
    accountNumber: '0291847192',
    kycStatus: 'Pending',
    status: 'Active',
    creditRating: 'B',
    registeredAt: '2026-02-15T13:00:00Z',
    notes: 'Pending land title verification from local registry.'
  }
];

const SEED_LOANS: Loan[] = [
  {
    id: 'ln-201',
    loanCode: 'LN-2026-014',
    farmerId: 'f-101',
    farmerName: 'Amara Okafor',
    farmerPhone: '+234 803 219 4481',
    farmSizeHectares: 12.5,
    purpose: 'Seed & Fertilizer',
    amountRequested: 3500,
    amountApproved: 3500,
    interestRate: 6.0,
    durationMonths: 6,
    repaymentFrequency: 'Seasonal Harvest',
    status: 'Repaying',
    applicationDate: '2026-01-05',
    approvedDate: '2026-01-12',
    disbursedDate: '2026-01-15',
    dueDate: '2026-07-15',
    totalRepaid: 1800,
    outstandingBalance: 1910, // Principal 3500 + 6% interest = 3710. Repaid 1800 -> 1910 balance
    collateralDescription: 'Warehouse Receipt for 15 MT Maize stored in Silo #2',
    guarantorName: 'Chief Emeka Eze (Cooperative President)',
    guarantorPhone: '+234 802 334 9102',
    riskAssessment: 'Low Risk',
    installments: [
      { installmentNumber: 1, dueDate: '2026-03-15', amountDue: 1855, amountPaid: 1800, status: 'Paid', paidAt: '2026-03-14' },
      { installmentNumber: 2, dueDate: '2026-07-15', amountDue: 1910, amountPaid: 0, status: 'Pending' }
    ],
    repayments: [
      {
        id: 'rep-001',
        amount: 1800,
        paymentDate: '2026-03-14',
        paymentMethod: 'Bank Transfer',
        referenceNo: 'FAB-TX-994812',
        recordedBy: 'Loan Officer Sarah Jenkins',
        notes: 'Mid-term grain harvest partial settlement'
      }
    ],
    notes: 'Pre-approved due to verified cooperative track record and high credit score.'
  },
  {
    id: 'ln-202',
    loanCode: 'LN-2026-015',
    farmerId: 'f-102',
    farmerName: 'Kwame Mensah',
    farmerPhone: '+233 24 819 0234',
    farmSizeHectares: 24.0,
    purpose: 'Irrigation Equipment',
    amountRequested: 6000,
    amountApproved: 5500,
    interestRate: 7.5,
    durationMonths: 12,
    repaymentFrequency: 'Quarterly',
    status: 'Disbursed',
    applicationDate: '2026-01-20',
    approvedDate: '2026-02-02',
    disbursedDate: '2026-02-05',
    dueDate: '2027-02-05',
    totalRepaid: 0,
    outstandingBalance: 5912.5, // 5500 + 7.5% = 5912.5
    collateralDescription: 'Registered Land Certificate 14-B Volta Basin',
    guarantorName: 'Akua Mensah',
    guarantorPhone: '+233 20 904 8819',
    riskAssessment: 'Low Risk',
    installments: [
      { installmentNumber: 1, dueDate: '2026-05-05', amountDue: 1478.12, amountPaid: 0, status: 'Pending' },
      { installmentNumber: 2, dueDate: '2026-08-05', amountDue: 1478.12, amountPaid: 0, status: 'Pending' },
      { installmentNumber: 3, dueDate: '2026-11-05', amountDue: 1478.12, amountPaid: 0, status: 'Pending' },
      { installmentNumber: 4, dueDate: '2027-02-05', amountDue: 1478.14, amountPaid: 0, status: 'Pending' }
    ],
    repayments: [],
    notes: 'Disbursed directly to certified solar pump vendor.'
  },
  {
    id: 'ln-203',
    loanCode: 'LN-2026-016',
    farmerId: 'f-104',
    farmerName: 'David Kiprono',
    farmerPhone: '+254 712 849 019',
    farmSizeHectares: 35.0,
    purpose: 'Tractor & Machinery',
    amountRequested: 12000,
    amountApproved: 10000,
    interestRate: 8.0,
    durationMonths: 18,
    repaymentFrequency: 'Quarterly',
    status: 'Approved',
    applicationDate: '2026-02-10',
    approvedDate: '2026-03-01',
    dueDate: '2027-09-01',
    totalRepaid: 0,
    outstandingBalance: 10800,
    collateralDescription: 'John Deere 5050D Tractor Logbook + Land Title #883',
    guarantorName: 'Eliud Kipchoge Farms Ltd',
    guarantorPhone: '+254 720 918 273',
    riskAssessment: 'Moderate Risk',
    installments: [
      { installmentNumber: 1, dueDate: '2026-06-01', amountDue: 1800, amountPaid: 0, status: 'Pending' },
      { installmentNumber: 2, dueDate: '2026-09-01', amountDue: 1800, amountPaid: 0, status: 'Pending' },
      { installmentNumber: 3, dueDate: '2026-12-01', amountDue: 1800, amountPaid: 0, status: 'Pending' },
      { installmentNumber: 4, dueDate: '2027-03-01', amountDue: 1800, amountPaid: 0, status: 'Pending' },
      { installmentNumber: 5, dueDate: '2027-06-01', amountDue: 1800, amountPaid: 0, status: 'Pending' },
      { installmentNumber: 6, dueDate: '2027-09-01', amountDue: 1800, amountPaid: 0, status: 'Pending' }
    ],
    repayments: [],
    notes: 'Loan approved by Credit Committee. Awaiting borrower signature on disbursement deed.'
  },
  {
    id: 'ln-204',
    loanCode: 'LN-2026-017',
    farmerId: 'f-103',
    farmerName: 'Fatima Zahra Diallo',
    farmerPhone: '+221 77 654 8812',
    farmSizeHectares: 8.2,
    purpose: 'Post-Harvest Storage',
    amountRequested: 2200,
    amountApproved: 0,
    interestRate: 5.5,
    durationMonths: 6,
    repaymentFrequency: 'Monthly',
    status: 'Pending',
    applicationDate: '2026-03-10',
    dueDate: '2026-09-10',
    totalRepaid: 0,
    outstandingBalance: 2321,
    collateralDescription: 'Cold storage unit lease agreement & coop guarantee',
    guarantorName: 'Aminata Ba',
    guarantorPhone: '+221 76 554 1122',
    riskAssessment: 'Low Risk',
    installments: [],
    repayments: [],
    notes: 'Under review by field agronomist for solar inverter specs.'
  }
];

const SEED_INFRASTRUCTURE: InfrastructureAsset[] = [
  {
    id: 'inf-301',
    assetCode: 'INF-SLO-01',
    name: 'Highland Apex Grain Silo Complex',
    category: 'Storage Silo',
    region: 'Eastern Highlands',
    district: 'Orlu Agro Valley',
    gpsCoordinates: '5.7981° N, 7.0392° E',
    capacity: '2,500 Metric Tons',
    condition: 'Operational',
    utilizationPercent: 82,
    installationDate: '2024-03-15',
    estimatedValueUsd: 85000,
    custodianType: 'Farmer Cooperative',
    custodianName: 'Umunna Progressive Agricultural Coop',
    custodianPhone: '+234 803 111 2233',
    beneficiaryFarmersCount: 145,
    lastMaintenanceDate: '2026-01-18',
    nextMaintenanceDue: '2026-07-18',
    maintenanceLogs: [
      {
        id: 'm-01',
        date: '2026-01-18',
        description: 'Aeration blower motor overhaul & moisture sensor calibration',
        cost: 650,
        technician: 'Eng. Chidi Nwankwo',
        partsReplaced: 'Filter cartridges & 2 thermistor cables',
        status: 'Completed'
      },
      {
        id: 'm-00',
        date: '2025-07-10',
        description: 'Annual fumigation & seal integrity inspection',
        cost: 400,
        technician: 'BioSafe Fumigations Ltd',
        status: 'Completed'
      }
    ],
    specifications: '3x Galvanized Steel Corrugated Silos with automated temperature & moisture telematics.'
  },
  {
    id: 'inf-302',
    assetCode: 'INF-BHL-02',
    name: 'Volta Solar Community Borehole #4',
    category: 'Solar Borehole',
    region: 'Volta Plains',
    district: 'Keta Agricultural District',
    gpsCoordinates: '5.9224° N, 0.9851° E',
    capacity: '18,000 Liters / Hour',
    condition: 'Operational',
    utilizationPercent: 95,
    installationDate: '2024-08-20',
    estimatedValueUsd: 22000,
    custodianType: 'Community Water Board',
    custodianName: 'Afife Irrigation Committee',
    custodianPhone: '+233 24 990 0112',
    beneficiaryFarmersCount: 220,
    lastMaintenanceDate: '2026-02-10',
    nextMaintenanceDue: '2026-08-10',
    maintenanceLogs: [
      {
        id: 'm-02',
        date: '2026-02-10',
        description: 'Solar PV panel cleaning and inverter inverter charge controller firmware upgrade',
        cost: 210,
        technician: 'Volta Solar Works',
        status: 'Completed'
      }
    ],
    specifications: '10 kW Tier-1 Monocrystalline solar array driving Grundfos submersible solar pump with 50,000L elevated storage.'
  },
  {
    id: 'inf-303',
    assetCode: 'INF-CLD-03',
    name: 'Podor Solar Cold Hub',
    category: 'Cold Storage Facility',
    region: 'Northern River Basin',
    district: 'Podor Agro Zone',
    gpsCoordinates: '16.6514° N, 14.9587° W',
    capacity: '35 Metric Tons',
    condition: 'Operational',
    utilizationPercent: 68,
    installationDate: '2025-02-11',
    estimatedValueUsd: 48000,
    custodianType: 'Farmer Cooperative',
    custodianName: 'Podor Women Horticultural Association',
    custodianPhone: '+221 77 009 1182',
    beneficiaryFarmersCount: 95,
    lastMaintenanceDate: '2026-01-05',
    nextMaintenanceDue: '2026-05-05',
    maintenanceLogs: [
      {
        id: 'm-03',
        date: '2026-01-05',
        description: 'Cooling cycle refrigerant R410A top-up and thermal curtain replacement',
        cost: 380,
        technician: 'Sahel Cold Tech',
        partsReplaced: 'Heavy duty PVC flap curtain',
        status: 'Completed'
      }
    ],
    specifications: 'Walk-in containerized solar-powered cold room maintained at 4°C - 8°C with thermal battery backup.'
  },
  {
    id: 'inf-304',
    assetCode: 'INF-TRC-04',
    name: 'Rift Valley Shared Mechanization Depot',
    category: 'Tractor / Equipment Depot',
    region: 'Central Rift Highlands',
    district: 'Eldoret Grain Corridor',
    gpsCoordinates: '0.5143° N, 35.2698° E',
    capacity: '6 Tractors + 4 Harvester Attachments',
    condition: 'Needs Maintenance',
    utilizationPercent: 88,
    installationDate: '2023-11-01',
    estimatedValueUsd: 140000,
    custodianType: 'Private-Public Entity',
    custodianName: 'Eldoret Agromech Services Hub',
    custodianPhone: '+254 720 001 992',
    beneficiaryFarmersCount: 310,
    lastMaintenanceDate: '2025-11-20',
    nextMaintenanceDue: '2026-03-25',
    maintenanceLogs: [
      {
        id: 'm-04',
        date: '2025-11-20',
        description: 'Tractor Unit #2 hydraulic steering pump seal leak repair',
        cost: 540,
        technician: 'AgriMachina Eldoret',
        status: 'Completed'
      }
    ],
    specifications: 'Centralized heavy farm machinery rental depot equipped with diagnostic bay and mobile repair van.'
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
    details: 'Recorded mid-term installment repayment of $1,800.00 via Bank Transfer.',
    performedBy: 'Sarah Jenkins (Loan Officer)'
  },
  {
    id: 'aud-02',
    timestamp: '2026-03-10T11:22:00Z',
    action: 'LOAN_APPLICATION_SUBMITTED',
    category: 'LOAN',
    entityId: 'ln-204',
    entityName: 'Fatima Zahra Diallo (LN-2026-017)',
    details: 'Submitted loan request for $2,200.00 for Cold Storage facility expansion.',
    performedBy: 'Fatima Zahra Diallo (Farmer Portal)'
  },
  {
    id: 'aud-03',
    timestamp: '2026-03-01T09:40:00Z',
    action: 'LOAN_APPROVED',
    category: 'LOAN',
    entityId: 'ln-203',
    entityName: 'David Kiprono (LN-2026-016)',
    details: 'Credit Committee approved $10,000.00 tractor financing at 8.0% APR.',
    performedBy: 'Marcus Vance (Credit Committee Chair)'
  },
  {
    id: 'aud-04',
    timestamp: '2026-02-15T13:00:00Z',
    action: 'FARMER_REGISTERED',
    category: 'FARMER',
    entityId: 'f-105',
    entityName: 'Grace Mutua',
    details: 'New farmer registered in Machakos Drylands zone (6.0 ha). KYC pending.',
    performedBy: 'Field Officer Brian Omondi'
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
      auditLogs: SEED_AUDIT_LOGS
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
      auditLogs: [
        {
          id: 'aud-' + Date.now(),
          timestamp: new Date().toISOString(),
          action: 'SYSTEM_RESET',
          category: 'SYSTEM',
          details: 'Database restored to initial seed dataset.',
          performedBy: 'Admin Operator'
        },
        ...JSON.parse(JSON.stringify(SEED_AUDIT_LOGS))
      ]
    };
    this.persist();
    return this.data;
  }

  // --- Farmers ---
  public getFarmers(): Farmer[] {
    return this.data.farmers;
  }

  public getFarmerById(id: string): Farmer | undefined {
    return this.data.farmers.find(f => f.id === id || f.farmerCode.toLowerCase() === id.toLowerCase());
  }

  public createFarmer(farmerData: Omit<Farmer, 'id' | 'farmerCode' | 'registeredAt'>): Farmer {
    const count = this.data.farmers.length + 1;
    const year = new Date().getFullYear();
    const farmerCode = `FRM-${year}-${String(count).padStart(3, '0')}`;
    const newFarmer: Farmer = {
      ...farmerData,
      id: 'f-' + Date.now(),
      farmerCode,
      registeredAt: new Date().toISOString()
    };
    this.data.farmers.unshift(newFarmer);
    
    this.addAuditLog({
      action: 'FARMER_REGISTERED',
      category: 'FARMER',
      entityId: newFarmer.id,
      entityName: newFarmer.fullName,
      details: `Registered farmer ${newFarmer.fullName} (${newFarmer.farmerCode}) with ${newFarmer.farmSizeHectares} ha.`,
      performedBy: 'AgriCore Staff'
    });

    this.persist();
    return newFarmer;
  }

  public updateFarmer(id: string, updates: Partial<Farmer>): Farmer | null {
    const index = this.data.farmers.findIndex(f => f.id === id);
    if (index === -1) return null;

    const existing = this.data.farmers[index];
    const updated: Farmer = { ...existing, ...updates, id: existing.id, farmerCode: existing.farmerCode };
    this.data.farmers[index] = updated;

    this.addAuditLog({
      action: 'FARMER_UPDATED',
      category: 'FARMER',
      entityId: updated.id,
      entityName: updated.fullName,
      details: `Profile updated for ${updated.fullName} (${updated.farmerCode}).`,
      performedBy: 'AgriCore Staff'
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
      details: `Removed farmer record ${deleted.fullName} (${deleted.farmerCode}).`,
      performedBy: 'AgriCore Admin'
    });

    this.persist();
    return true;
  }

  // --- Loans ---
  public getLoans(): Loan[] {
    return this.data.loans;
  }

  public getLoanById(id: string): Loan | undefined {
    return this.data.loans.find(l => l.id === id || l.loanCode.toLowerCase() === id.toLowerCase());
  }

  public createLoan(data: {
    farmerId: string;
    purpose: Loan['purpose'];
    amountRequested: number;
    interestRate: number;
    durationMonths: number;
    repaymentFrequency: Loan['repaymentFrequency'];
    collateralDescription: string;
    guarantorName: string;
    guarantorPhone: string;
    notes?: string;
  }): Loan {
    const farmer = this.getFarmerById(data.farmerId);
    if (!farmer) throw new Error('Farmer not found');

    const count = this.data.loans.length + 1;
    const year = new Date().getFullYear();
    const loanCode = `LN-${year}-${String(count).padStart(3, '0')}`;

    // Calculate initial estimated risk assessment
    let riskAssessment: Loan['riskAssessment'] = 'Low Risk';
    if (farmer.creditRating === 'C' || farmer.kycStatus === 'Pending') {
      riskAssessment = 'High Risk';
    } else if (farmer.creditRating === 'B' || data.amountRequested > 8000) {
      riskAssessment = 'Moderate Risk';
    }

    const applicationDate = new Date().toISOString().split('T')[0];
    const due = new Date();
    due.setMonth(due.getMonth() + data.durationMonths);
    const dueDate = due.toISOString().split('T')[0];

    const newLoan: Loan = {
      id: 'ln-' + Date.now(),
      loanCode,
      farmerId: farmer.id,
      farmerName: farmer.fullName,
      farmerPhone: farmer.phone,
      farmSizeHectares: farmer.farmSizeHectares,
      purpose: data.purpose,
      amountRequested: data.amountRequested,
      amountApproved: 0,
      interestRate: data.interestRate || 6.5,
      durationMonths: data.durationMonths,
      repaymentFrequency: data.repaymentFrequency,
      status: 'Pending',
      applicationDate,
      dueDate,
      totalRepaid: 0,
      outstandingBalance: Math.round(data.amountRequested * (1 + (data.interestRate || 6.5) / 100)),
      collateralDescription: data.collateralDescription,
      guarantorName: data.guarantorName,
      guarantorPhone: data.guarantorPhone,
      riskAssessment,
      installments: [],
      repayments: [],
      notes: data.notes
    };

    this.data.loans.unshift(newLoan);

    this.addAuditLog({
      action: 'LOAN_APPLIED',
      category: 'LOAN',
      entityId: newLoan.id,
      entityName: `${farmer.fullName} (${loanCode})`,
      details: `New loan application of $${data.amountRequested.toLocaleString()} for ${data.purpose}.`,
      performedBy: 'Loan Intake Desk'
    });

    this.persist();
    return newLoan;
  }

  public updateLoanStatus(
    id: string,
    status: Loan['status'],
    amountApproved?: number,
    notes?: string
  ): Loan | null {
    const loan = this.data.loans.find(l => l.id === id);
    if (!loan) return null;

    const previousStatus = loan.status;
    loan.status = status;
    if (notes) loan.notes = (loan.notes ? loan.notes + '\n' : '') + notes;

    const todayStr = new Date().toISOString().split('T')[0];

    if (status === 'Approved') {
      loan.approvedDate = todayStr;
      loan.amountApproved = amountApproved !== undefined && amountApproved > 0 ? amountApproved : loan.amountRequested;
      loan.outstandingBalance = Math.round(loan.amountApproved * (1 + loan.interestRate / 100));
      
      // Auto-generate installments
      const numInstallments = loan.repaymentFrequency === 'Monthly' 
        ? loan.durationMonths 
        : loan.repaymentFrequency === 'Quarterly' 
        ? Math.max(1, Math.floor(loan.durationMonths / 3)) 
        : 2; // Seasonal

      const perInstallment = Number((loan.outstandingBalance / numInstallments).toFixed(2));
      const newInstallments: LoanInstallment[] = [];
      const intervalMonths = Math.max(1, Math.floor(loan.durationMonths / numInstallments));

      for (let i = 1; i <= numInstallments; i++) {
        const instDue = new Date();
        instDue.setMonth(instDue.getMonth() + i * intervalMonths);
        newInstallments.push({
          installmentNumber: i,
          dueDate: instDue.toISOString().split('T')[0],
          amountDue: i === numInstallments ? Number((loan.outstandingBalance - perInstallment * (numInstallments - 1)).toFixed(2)) : perInstallment,
          amountPaid: 0,
          status: 'Pending'
        });
      }
      loan.installments = newInstallments;
    } else if (status === 'Disbursed') {
      loan.disbursedDate = todayStr;
      loan.status = 'Disbursed';
    }

    this.addAuditLog({
      action: 'LOAN_STATUS_UPDATED',
      category: 'LOAN',
      entityId: loan.id,
      entityName: `${loan.farmerName} (${loan.loanCode})`,
      details: `Loan status changed from ${previousStatus} to ${status}. Amount: $${(loan.amountApproved || loan.amountRequested).toLocaleString()}.`,
      performedBy: 'Credit Committee'
    });

    this.persist();
    return loan;
  }

  public recordRepayment(
    loanId: string,
    amount: number,
    paymentMethod: RepaymentRecord['paymentMethod'],
    referenceNo: string,
    recordedBy: string,
    notes?: string
  ): Loan | null {
    const loan = this.data.loans.find(l => l.id === loanId);
    if (!loan) return null;

    const repayment: RepaymentRecord = {
      id: 'rep-' + Date.now(),
      amount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      referenceNo,
      recordedBy,
      notes
    };

    loan.repayments.unshift(repayment);
    loan.totalRepaid = Number((loan.totalRepaid + amount).toFixed(2));
    loan.outstandingBalance = Math.max(0, Number((loan.outstandingBalance - amount).toFixed(2)));

    // Allocate payment against installments
    let remainingPayment = amount;
    for (const inst of loan.installments) {
      if (remainingPayment <= 0) break;
      const needed = inst.amountDue - inst.amountPaid;
      if (needed > 0) {
        const payForInst = Math.min(needed, remainingPayment);
        inst.amountPaid = Number((inst.amountPaid + payForInst).toFixed(2));
        remainingPayment -= payForInst;
        if (inst.amountPaid >= inst.amountDue) {
          inst.status = 'Paid';
          inst.paidAt = repayment.paymentDate;
        }
      }
    }

    if (loan.outstandingBalance <= 0) {
      loan.status = 'Completed';
    } else if (loan.status === 'Disbursed' || loan.status === 'Approved') {
      loan.status = 'Repaying';
    }

    this.addAuditLog({
      action: 'REPAYMENT_RECORDED',
      category: 'LOAN',
      entityId: loan.id,
      entityName: `${loan.farmerName} (${loan.loanCode})`,
      details: `Recorded repayment of $${amount.toLocaleString()} via ${paymentMethod}. Outstanding: $${loan.outstandingBalance.toLocaleString()}.`,
      performedBy: recordedBy
    });

    this.persist();
    return loan;
  }

  // --- Infrastructure Assets ---
  public getInfrastructure(): InfrastructureAsset[] {
    return this.data.infrastructure;
  }

  public getInfrastructureById(id: string): InfrastructureAsset | undefined {
    return this.data.infrastructure.find(i => i.id === id || i.assetCode.toLowerCase() === id.toLowerCase());
  }

  public createInfrastructure(data: Omit<InfrastructureAsset, 'id' | 'assetCode' | 'maintenanceLogs'>): InfrastructureAsset {
    const count = this.data.infrastructure.length + 1;
    const catCode = data.category.slice(0, 3).toUpperCase();
    const assetCode = `INF-${catCode}-${String(count).padStart(2, '0')}`;

    const newAsset: InfrastructureAsset = {
      ...data,
      id: 'inf-' + Date.now(),
      assetCode,
      maintenanceLogs: []
    };

    this.data.infrastructure.unshift(newAsset);

    this.addAuditLog({
      action: 'INFRASTRUCTURE_CREATED',
      category: 'INFRASTRUCTURE',
      entityId: newAsset.id,
      entityName: newAsset.name,
      details: `Commissioned new asset ${newAsset.name} (${assetCode}) with value $${data.estimatedValueUsd.toLocaleString()}.`,
      performedBy: 'Infrastructure Directorate'
    });

    this.persist();
    return newAsset;
  }

  public updateInfrastructure(id: string, updates: Partial<InfrastructureAsset>): InfrastructureAsset | null {
    const index = this.data.infrastructure.findIndex(i => i.id === id);
    if (index === -1) return null;

    const existing = this.data.infrastructure[index];
    const updated: InfrastructureAsset = {
      ...existing,
      ...updates,
      id: existing.id,
      assetCode: existing.assetCode,
      maintenanceLogs: existing.maintenanceLogs
    };

    this.data.infrastructure[index] = updated;

    this.addAuditLog({
      action: 'INFRASTRUCTURE_UPDATED',
      category: 'INFRASTRUCTURE',
      entityId: updated.id,
      entityName: updated.name,
      details: `Updated asset status: ${updated.name} condition is now ${updated.condition}.`,
      performedBy: 'Infrastructure Maintenance Team'
    });

    this.persist();
    return updated;
  }

  public addMaintenanceLog(
    assetId: string,
    log: Omit<MaintenanceLog, 'id'>,
    nextScheduledDue?: string
  ): InfrastructureAsset | null {
    const asset = this.data.infrastructure.find(i => i.id === assetId);
    if (!asset) return null;

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
      details: `Completed maintenance: ${log.description} ($${log.cost}). Technician: ${log.technician}.`,
      performedBy: log.technician
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

    const totalFarmers = farmers.length;
    const activeFarmers = farmers.filter(f => f.status === 'Active').length;
    const verifiedFarmers = farmers.filter(f => f.kycStatus === 'Verified').length;
    const totalHectaresCultivated = farmers.reduce((sum, f) => sum + (f.farmSizeHectares || 0), 0);

    const disbursedLoans = loans.filter(l => ['Disbursed', 'Repaying', 'Completed', 'Defaulted'].includes(l.status));
    const totalCapitalDisbursedUsd = disbursedLoans.reduce((sum, l) => sum + (l.amountApproved || l.amountRequested), 0);
    const totalRepaidUsd = disbursedLoans.reduce((sum, l) => sum + (l.totalRepaid || 0), 0);
    const outstandingDebtUsd = disbursedLoans.reduce((sum, l) => sum + (l.outstandingBalance || 0), 0);
    const repaymentRatePercent = totalCapitalDisbursedUsd > 0
      ? Number(((totalRepaidUsd / (totalRepaidUsd + outstandingDebtUsd)) * 100).toFixed(1))
      : 100;

    const defaultedLoansCount = loans.filter(l => l.status === 'Defaulted').length;
    const pendingLoanApplications = loans.filter(l => l.status === 'Pending').length;

    const totalInfrastructureAssets = infra.length;
    const operationalInfrastructureCount = infra.filter(i => i.condition === 'Operational').length;
    const infrastructureValueUsd = infra.reduce((sum, i) => sum + (i.estimatedValueUsd || 0), 0);

    return {
      totalFarmers,
      activeFarmers,
      verifiedFarmers,
      totalLoansDisbursed: disbursedLoans.length,
      totalCapitalDisbursedUsd,
      totalRepaidUsd,
      outstandingDebtUsd,
      repaymentRatePercent,
      defaultedLoansCount,
      pendingLoanApplications,
      totalInfrastructureAssets,
      operationalInfrastructureCount,
      infrastructureValueUsd,
      totalHectaresCultivated: Number(totalHectaresCultivated.toFixed(1))
    };
  }

  public getRawDatabase(): DatabaseSchema {
    return this.data;
  }
}

export const db = new Database();
