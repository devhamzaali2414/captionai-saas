'use client';

import { useState, useEffect } from 'react';
import { getAllClinics, switchCurrentClinic, createNewClinic } from '@/app/actions/clinic';

export default function ClinicSwitcher() {
  const [clinics, setClinics] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClinicName, setNewClinicName] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');

  useEffect(() => {
    getAllClinics().then(setClinics);
  }, []);

  const activeClinic = clinics.find(c => c.isCurrent) || clinics[0];

  async function handleSwitch(clinicId: number) {
    await switchCurrentClinic(clinicId);
    const updated = await getAllClinics();
    setClinics(updated);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await createNewClinic(formData);
    const updated = await getAllClinics();
    setClinics(updated);
    setShowAddModal(false);
    setNewClinicName('');
    setNewSpecialty('');
  }

  if (clinics.length === 0) return null;

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Active Practice
        </span>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none' }}
        >
          + New Clinic
        </button>
      </div>

      <select
        value={activeClinic?.id || ''}
        onChange={(e) => handleSwitch(parseInt(e.target.value, 10))}
        style={{
          padding: '0.45rem 0.65rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          background: 'var(--background)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          cursor: 'pointer',
        }}
      >
        {clinics.map((clinic) => (
          <option key={clinic.id} value={clinic.id}>
            🏥 {clinic.name || 'Main Clinic'} ({clinic.specialty || 'General'})
          </option>
        ))}
      </select>

      {/* Modal to Add Clinic */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: '1rem',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '440px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              🏥 Add New Clinic / Practice
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Manage multiple clinic locations or specialties separately.
            </p>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Practice Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={newClinicName}
                  onChange={(e) => setNewClinicName(e.target.value)}
                  placeholder="e.g. Westside Dental Specialists"
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Specialty:
                </label>
                <input
                  type="text"
                  name="specialty"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="e.g. Pediatric Dentistry, Dermatology"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Clinic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
