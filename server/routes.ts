import { Router, Request, Response } from 'express';
import { db } from './db';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'AgriCore API Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// System KPI & Analytics Aggregations
apiRouter.get('/stats', (_req: Request, res: Response) => {
  try {
    const stats = db.getStats();
    const farmers = db.getFarmers();
    const loans = db.getLoans();
    const infrastructure = db.getInfrastructure();

    // Regional distribution of farmers
    const regionalDistribution: Record<string, number> = {};
    farmers.forEach(f => {
      regionalDistribution[f.region] = (regionalDistribution[f.region] || 0) + 1;
    });

    // Top primary crops
    const cropCounts: Record<string, number> = {};
    farmers.forEach(f => {
      f.primaryCrops.forEach(crop => {
        cropCounts[crop] = (cropCounts[crop] || 0) + 1;
      });
    });

    // Loans by purpose
    const loansByPurpose: Record<string, { count: number; totalAmount: number }> = {};
    loans.forEach(l => {
      if (!loansByPurpose[l.purpose]) {
        loansByPurpose[l.purpose] = { count: 0, totalAmount: 0 };
      }
      loansByPurpose[l.purpose].count += 1;
      loansByPurpose[l.purpose].totalAmount += (l.amountApproved || l.amountRequested);
    });

    // Infrastructure condition breakdown
    const infraConditions: Record<string, number> = {};
    infrastructure.forEach(i => {
      infraConditions[i.condition] = (infraConditions[i.condition] || 0) + 1;
    });

    res.json({
      summary: stats,
      analytics: {
        regionalDistribution,
        cropCounts,
        loansByPurpose,
        infraConditions
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to calculate stats' });
  }
});

// ================= FARMERS ENDPOINTS =================
apiRouter.get('/farmers', (req: Request, res: Response) => {
  try {
    let farmers = db.getFarmers();
    const { search, region, status, kycStatus } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      farmers = farmers.filter(f =>
        f.fullName.toLowerCase().includes(q) ||
        f.farmerCode.toLowerCase().includes(q) ||
        f.phone.toLowerCase().includes(q) ||
        f.nationalId.toLowerCase().includes(q) ||
        f.cooperativeName.toLowerCase().includes(q)
      );
    }

    if (region && typeof region === 'string' && region !== 'all') {
      farmers = farmers.filter(f => f.region.toLowerCase() === region.toLowerCase());
    }

    if (status && typeof status === 'string' && status !== 'all') {
      farmers = farmers.filter(f => f.status.toLowerCase() === status.toLowerCase());
    }

    if (kycStatus && typeof kycStatus === 'string' && kycStatus !== 'all') {
      farmers = farmers.filter(f => f.kycStatus.toLowerCase() === kycStatus.toLowerCase());
    }

    res.json(farmers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get('/farmers/:id', (req: Request, res: Response) => {
  const farmer = db.getFarmerById(req.params.id);
  if (!farmer) {
    res.status(404).json({ error: 'Farmer not found' });
    return;
  }
  // Also attach farmer's loans
  const loans = db.getLoans().filter(l => l.farmerId === farmer.id);
  res.json({ ...farmer, loans });
});

apiRouter.post('/farmers', (req: Request, res: Response) => {
  try {
    const {
      fullName,
      nationalId,
      phone,
      email,
      gender,
      dob,
      region,
      district,
      village,
      farmSizeHectares,
      ownershipStatus,
      primaryCrops,
      secondaryCrops,
      livestockTypes,
      soilType,
      irrigationType,
      cooperativeName,
      bankName,
      accountNumber,
      kycStatus,
      status,
      creditRating,
      notes
    } = req.body;

    if (!fullName || !phone || !nationalId) {
      res.status(400).json({ error: 'Full name, National ID, and Phone number are required' });
      return;
    }

    const newFarmer = db.createFarmer({
      fullName,
      nationalId,
      phone,
      email: email || '',
      gender: gender || 'Male',
      dob: dob || '1990-01-01',
      region: region || 'Central Highlands',
      district: district || 'Valley District',
      village: village || 'Central Farmlands',
      farmSizeHectares: Number(farmSizeHectares) || 1,
      ownershipStatus: ownershipStatus || 'Owned',
      primaryCrops: Array.isArray(primaryCrops) ? primaryCrops : (primaryCrops ? [primaryCrops] : ['Maize']),
      secondaryCrops: Array.isArray(secondaryCrops) ? secondaryCrops : (secondaryCrops ? [secondaryCrops] : []),
      livestockTypes: Array.isArray(livestockTypes) ? livestockTypes : (livestockTypes ? [livestockTypes] : []),
      soilType: soilType || 'Loamy',
      irrigationType: irrigationType || 'Rainfed',
      cooperativeName: cooperativeName || 'Independent Farmer',
      bankName: bankName || 'Agri Development Bank',
      accountNumber: accountNumber || '',
      kycStatus: kycStatus || 'Pending',
      status: status || 'Active',
      creditRating: creditRating || 'B',
      notes
    });

    res.status(201).json(newFarmer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put('/farmers/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateFarmer(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Farmer not found' });
      return;
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete('/farmers/:id', (req: Request, res: Response) => {
  try {
    const success = db.deleteFarmer(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Farmer not found' });
      return;
    }
    res.json({ success: true, message: 'Farmer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ================= LOANS ENDPOINTS =================
apiRouter.get('/loans', (req: Request, res: Response) => {
  try {
    let loans = db.getLoans();
    const { status, farmerId, search } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      loans = loans.filter(l =>
        l.loanCode.toLowerCase().includes(q) ||
        l.farmerName.toLowerCase().includes(q) ||
        l.purpose.toLowerCase().includes(q) ||
        l.farmerPhone.toLowerCase().includes(q)
      );
    }

    if (status && typeof status === 'string' && status !== 'all') {
      loans = loans.filter(l => l.status.toLowerCase() === status.toLowerCase());
    }

    if (farmerId && typeof farmerId === 'string') {
      loans = loans.filter(l => l.farmerId === farmerId);
    }

    res.json(loans);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get('/loans/:id', (req: Request, res: Response) => {
  const loan = db.getLoanById(req.params.id);
  if (!loan) {
    res.status(404).json({ error: 'Loan not found' });
    return;
  }
  res.json(loan);
});

apiRouter.post('/loans', (req: Request, res: Response) => {
  try {
    const {
      farmerId,
      purpose,
      amountRequested,
      interestRate,
      durationMonths,
      repaymentFrequency,
      collateralDescription,
      guarantorName,
      guarantorPhone,
      notes
    } = req.body;

    if (!farmerId || !amountRequested || !purpose) {
      res.status(400).json({ error: 'Farmer, Purpose, and Amount Requested are required' });
      return;
    }

    const loan = db.createLoan({
      farmerId,
      purpose,
      amountRequested: Number(amountRequested),
      interestRate: Number(interestRate) || 6.5,
      durationMonths: Number(durationMonths) || 6,
      repaymentFrequency: repaymentFrequency || 'Monthly',
      collateralDescription: collateralDescription || 'Personal guarantee and agricultural output receipt',
      guarantorName: guarantorName || 'Cooperative Group Guarantee',
      guarantorPhone: guarantorPhone || '',
      notes
    });

    res.status(201).json(loan);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

apiRouter.post('/loans/:id/status', (req: Request, res: Response) => {
  try {
    const { status, amountApproved, notes } = req.body;
    if (!status) {
      res.status(400).json({ error: 'Status is required' });
      return;
    }

    const loan = db.updateLoanStatus(req.params.id, status, amountApproved ? Number(amountApproved) : undefined, notes);
    if (!loan) {
      res.status(404).json({ error: 'Loan not found' });
      return;
    }

    res.json(loan);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/loans/:id/repay', (req: Request, res: Response) => {
  try {
    const { amount, paymentMethod, referenceNo, recordedBy, notes } = req.body;
    if (!amount || Number(amount) <= 0) {
      res.status(400).json({ error: 'Valid repayment amount is required' });
      return;
    }

    const updatedLoan = db.recordRepayment(
      req.params.id,
      Number(amount),
      paymentMethod || 'Mobile Money (M-Pesa)',
      referenceNo || `TX-${Date.now().toString().slice(-6)}`,
      recordedBy || 'Loan Officer',
      notes
    );

    if (!updatedLoan) {
      res.status(404).json({ error: 'Loan not found' });
      return;
    }

    res.json(updatedLoan);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ================= INFRASTRUCTURE ENDPOINTS =================
apiRouter.get('/infrastructure', (req: Request, res: Response) => {
  try {
    let infra = db.getInfrastructure();
    const { category, condition, search } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      infra = infra.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.assetCode.toLowerCase().includes(q) ||
        i.district.toLowerCase().includes(q) ||
        i.custodianName.toLowerCase().includes(q)
      );
    }

    if (category && typeof category === 'string' && category !== 'all') {
      infra = infra.filter(i => i.category.toLowerCase() === category.toLowerCase());
    }

    if (condition && typeof condition === 'string' && condition !== 'all') {
      infra = infra.filter(i => i.condition.toLowerCase() === condition.toLowerCase());
    }

    res.json(infra);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get('/infrastructure/:id', (req: Request, res: Response) => {
  const asset = db.getInfrastructureById(req.params.id);
  if (!asset) {
    res.status(404).json({ error: 'Infrastructure asset not found' });
    return;
  }
  res.json(asset);
});

apiRouter.post('/infrastructure', (req: Request, res: Response) => {
  try {
    const {
      name,
      category,
      region,
      district,
      gpsCoordinates,
      capacity,
      condition,
      utilizationPercent,
      installationDate,
      estimatedValueUsd,
      custodianType,
      custodianName,
      custodianPhone,
      beneficiaryFarmersCount,
      lastMaintenanceDate,
      nextMaintenanceDue,
      specifications
    } = req.body;

    if (!name || !category) {
      res.status(400).json({ error: 'Name and Category are required' });
      return;
    }

    const newAsset = db.createInfrastructure({
      name,
      category: category || 'Solar Borehole',
      region: region || 'Central Highlands',
      district: district || 'Central Agro Zone',
      gpsCoordinates: gpsCoordinates || '0.0000° N, 0.0000° E',
      capacity: capacity || 'Standard Capacity',
      condition: condition || 'Operational',
      utilizationPercent: Number(utilizationPercent) || 75,
      installationDate: installationDate || new Date().toISOString().split('T')[0],
      estimatedValueUsd: Number(estimatedValueUsd) || 15000,
      custodianType: custodianType || 'Farmer Cooperative',
      custodianName: custodianName || 'Local Cooperative Board',
      custodianPhone: custodianPhone || '+234 800 000 0000',
      beneficiaryFarmersCount: Number(beneficiaryFarmersCount) || 50,
      lastMaintenanceDate: lastMaintenanceDate || new Date().toISOString().split('T')[0],
      nextMaintenanceDue: nextMaintenanceDue || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      specifications
    });

    res.status(201).json(newAsset);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put('/infrastructure/:id', (req: Request, res: Response) => {
  try {
    const updated = db.updateInfrastructure(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Asset not found' });
      return;
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/infrastructure/:id/maintenance', (req: Request, res: Response) => {
  try {
    const { description, cost, technician, partsReplaced, status, nextScheduledDue } = req.body;

    if (!description || !technician) {
      res.status(400).json({ error: 'Description and Technician are required' });
      return;
    }

    const updated = db.addMaintenanceLog(
      req.params.id,
      {
        date: new Date().toISOString().split('T')[0],
        description,
        cost: Number(cost) || 0,
        technician,
        partsReplaced,
        status: status || 'Completed'
      },
      nextScheduledDue
    );

    if (!updated) {
      res.status(404).json({ error: 'Asset not found' });
      return;
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete('/infrastructure/:id', (req: Request, res: Response) => {
  try {
    const success = db.deleteInfrastructure(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Asset not found' });
      return;
    }
    res.json({ success: true, message: 'Asset deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ================= AUDIT LOGS & UTILS =================
apiRouter.get('/audit-logs', (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 100;
  res.json(db.getAuditLogs(limit));
});

apiRouter.post('/seed-reset', (_req: Request, res: Response) => {
  const data = db.resetToSeed();
  res.json({ success: true, message: 'Database reset to seed data successfully', data });
});

apiRouter.get('/export', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="agricore_backup.json"');
  res.send(JSON.stringify(db.getRawDatabase(), null, 2));
});
