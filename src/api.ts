import { Farmer, Loan, InfrastructureAsset, AuditLog, AnalyticsData } from './types';

const API_BASE = '/api';

export const api = {
  // Stats
  async getStats(): Promise<AnalyticsData> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch system stats');
    return res.json();
  },

  async getSummary(): Promise<AnalyticsData> {
    return this.getStats();
  },

  // Farmers
  async getFarmers(params?: { search?: string; region?: string; status?: string; kycStatus?: string }): Promise<Farmer[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.region && params.region !== 'all') query.set('region', params.region);
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.kycStatus && params.kycStatus !== 'all') query.set('kycStatus', params.kycStatus);

    const res = await fetch(`${API_BASE}/farmers?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch farmers list');
    return res.json();
  },

  async getFarmer(id: string): Promise<Farmer> {
    const res = await fetch(`${API_BASE}/farmers/${id}`);
    if (!res.ok) throw new Error('Failed to fetch farmer profile');
    return res.json();
  },

  async createFarmer(farmer: Partial<Farmer>): Promise<Farmer> {
    const res = await fetch(`${API_BASE}/farmers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmer),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create farmer' }));
      throw new Error(err.error || 'Failed to create farmer');
    }
    return res.json();
  },

  async updateFarmer(id: string, updates: Partial<Farmer>): Promise<Farmer> {
    const res = await fetch(`${API_BASE}/farmers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update farmer');
    return res.json();
  },

  async deleteFarmer(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/farmers/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete farmer');
  },

  // Loans
  async getLoans(params?: { search?: string; status?: string; farmerId?: string }): Promise<Loan[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.farmerId) query.set('farmerId', params.farmerId);

    const res = await fetch(`${API_BASE}/loans?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch loans');
    return res.json();
  },

  async getLoan(id: string): Promise<Loan> {
    const res = await fetch(`${API_BASE}/loans/${id}`);
    if (!res.ok) throw new Error('Failed to fetch loan details');
    return res.json();
  },

  async createLoan(loanData: {
    farmerId: string;
    purpose: string;
    amountRequested: number;
    interestRate: number;
    durationMonths: number;
    repaymentFrequency: string;
    collateralDescription?: string;
    guarantorName?: string;
    guarantorPhone?: string;
    notes?: string;
  }): Promise<Loan> {
    const res = await fetch(`${API_BASE}/loans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loanData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to submit loan application' }));
      throw new Error(err.error || 'Failed to submit loan application');
    }
    return res.json();
  },

  async applyForLoan(loanData: Parameters<typeof this.createLoan>[0]): Promise<Loan> {
    return this.createLoan(loanData);
  },

  async updateLoanStatus(id: string, status: string, amountApproved?: number, notes?: string): Promise<Loan> {
    const res = await fetch(`${API_BASE}/loans/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, amountApproved, notes }),
    });
    if (!res.ok) throw new Error('Failed to update loan status');
    return res.json();
  },

  async recordRepayment(id: string, repayment: {
    amount: number;
    paymentMethod: string;
    referenceNo: string;
    recordedBy: string;
    notes?: string;
  }): Promise<Loan> {
    const res = await fetch(`${API_BASE}/loans/${id}/repay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(repayment),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to record repayment' }));
      throw new Error(err.error || 'Failed to record repayment');
    }
    return res.json();
  },

  // Infrastructure
  async getInfrastructure(params?: { search?: string; category?: string; condition?: string }): Promise<InfrastructureAsset[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.condition && params.condition !== 'all') query.set('condition', params.condition);

    const res = await fetch(`${API_BASE}/infrastructure?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch infrastructure assets');
    return res.json();
  },

  async getInfrastructureAsset(id: string): Promise<InfrastructureAsset> {
    const res = await fetch(`${API_BASE}/infrastructure/${id}`);
    if (!res.ok) throw new Error('Failed to fetch asset');
    return res.json();
  },

  async createInfrastructure(asset: Partial<InfrastructureAsset>): Promise<InfrastructureAsset> {
    const res = await fetch(`${API_BASE}/infrastructure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asset),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create asset' }));
      throw new Error(err.error || 'Failed to create asset');
    }
    return res.json();
  },

  async updateInfrastructure(id: string, updates: Partial<InfrastructureAsset>): Promise<InfrastructureAsset> {
    const res = await fetch(`${API_BASE}/infrastructure/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update asset');
    return res.json();
  },

  async logMaintenance(id: string, log: {
    description: string;
    cost: number;
    technician: string;
    partsReplaced?: string;
    status?: string;
    nextScheduledDue?: string;
  }): Promise<InfrastructureAsset> {
    const res = await fetch(`${API_BASE}/infrastructure/${id}/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });
    if (!res.ok) throw new Error('Failed to log maintenance');
    return res.json();
  },

  async deleteInfrastructure(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/infrastructure/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete asset');
  },

  // Audit Logs & System
  async getAuditLogs(limit = 50): Promise<AuditLog[]> {
    const res = await fetch(`${API_BASE}/audit-logs?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  async resetSeedData(): Promise<void> {
    const res = await fetch(`${API_BASE}/seed-reset`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset seed data');
  },

  exportDatabaseUrl(): string {
    return `${API_BASE}/export`;
  }
};
