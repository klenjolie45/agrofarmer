import React, { useState } from 'react';
import { InfrastructureAsset } from '../types';
import { X, Warehouse, MapPin, Wrench } from 'lucide-react';

interface InfrastructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assetData: Partial<InfrastructureAsset>) => Promise<void>;
}

export const InfrastructureModal: React.FC<InfrastructureModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<InfrastructureAsset>>({
    name: '',
    category: 'Solar Borehole',
    region: 'Eastern Highlands',
    district: 'Orlu Agro Valley',
    gpsCoordinates: '5.8100° N, 7.0200° E',
    capacity: '15,000 Liters / Hour',
    condition: 'Operational',
    utilizationPercent: 75,
    installationDate: new Date().toISOString().split('T')[0],
    estimatedValueUsd: 25000,
    custodianType: 'Farmer Cooperative',
    custodianName: 'Regional Farmers Union',
    custodianPhone: '+234 800 000 1122',
    beneficiaryFarmersCount: 120,
    lastMaintenanceDate: new Date().toISOString().split('T')[0],
    nextMaintenanceDue: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    specifications: 'Solar powered multi-tap community irrigation installation.'
  });

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Asset name is required.');
      return;
    }

    try {
      setSaving(true);
      await onSave(formData);
      onClose();
    } catch (err: any) {
      alert('Error creating asset: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Warehouse className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-base">Register Agricultural Infrastructure Asset</h3>
              <p className="text-xs text-emerald-200">
                Log silos, solar wells, irrigation canals, cold hubs, and equipment depots.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Asset Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Afife Solar Community Borehole #5"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-medium"
              >
                <option value="Storage Silo">Storage Silo (Grains / Cereals)</option>
                <option value="Solar Borehole">Solar Borehole (Deep Well)</option>
                <option value="Irrigation Network">Irrigation Network & Canals</option>
                <option value="Cold Storage Facility">Cold Storage Facility (Vegetables / Fruits)</option>
                <option value="Processing Plant">Processing Plant (Milling / Drying)</option>
                <option value="Tractor / Equipment Depot">Tractor & Heavy Machinery Depot</option>
                <option value="Greenhouse Hub">Greenhouse Horticultural Hub</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Capacity & Rating *</label>
              <input
                type="text"
                required
                placeholder="e.g. 1,500 Metric Tons or 25,000 L/hr"
                value={formData.capacity}
                onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Region</label>
              <input
                type="text"
                value={formData.region}
                onChange={e => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">District / Zone</label>
              <input
                type="text"
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">GPS Coordinates</label>
              <input
                type="text"
                value={formData.gpsCoordinates}
                onChange={e => setFormData({ ...formData, gpsCoordinates: e.target.value })}
                placeholder="e.g. 5.922° N, 0.985° E"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Initial Condition</label>
              <select
                value={formData.condition}
                onChange={e => setFormData({ ...formData, condition: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-medium"
              >
                <option value="Operational">Operational</option>
                <option value="Needs Maintenance">Needs Maintenance</option>
                <option value="Critical Repair">Critical Repair</option>
                <option value="Under Construction">Under Construction</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Utilization Load (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.utilizationPercent}
                onChange={e => setFormData({ ...formData, utilizationPercent: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Estimated Asset Value ($)</label>
              <input
                type="number"
                min="0"
                step="500"
                value={formData.estimatedValueUsd}
                onChange={e => setFormData({ ...formData, estimatedValueUsd: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Custodian Entity</label>
              <select
                value={formData.custodianType}
                onChange={e => setFormData({ ...formData, custodianType: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
              >
                <option value="Farmer Cooperative">Farmer Cooperative</option>
                <option value="Community Water Board">Community Water Board</option>
                <option value="Municipal District">Municipal District</option>
                <option value="Private-Public Entity">Private-Public Entity</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Custodian Contact Name</label>
              <input
                type="text"
                placeholder="Manager / Committee Head"
                value={formData.custodianName}
                onChange={e => setFormData({ ...formData, custodianName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Beneficiary Farmers Count</label>
              <input
                type="number"
                min="1"
                value={formData.beneficiaryFarmersCount}
                onChange={e => setFormData({ ...formData, beneficiaryFarmersCount: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Technical Specifications & Notes</label>
            <textarea
              rows={3}
              value={formData.specifications}
              onChange={e => setFormData({ ...formData, specifications: e.target.value })}
              placeholder="Inverter wattage, pipe dimensions, generator backup, grain moisture sensors..."
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-200 text-stone-700 font-semibold cursor-pointer hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              {saving ? 'Registering...' : 'Register Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
