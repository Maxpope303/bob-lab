import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import Dashboard from '../../pages/Dashboard'
import * as api from '../../api/pharmacyApi'

vi.mock('../../api/pharmacyApi')

const mockStats = {
  totalPrescriptions: 12,
  totalOrders: 8,
  pendingPrescriptions: [
    {
      id: 'RX001',
      patientName: 'Alice Smith',
      patientId: 'P001',
      doctorName: 'Dr. Jones',
      medicineId: 'MED001',
      medicineName: 'Amoxicillin 500mg',
      quantity: 14,
      dosage: '500mg twice daily',
      prescriptionDate: '2026-01-01',
      expiryDate: '2026-02-01',
      status: 'PENDING' as const,
      notes: '',
    },
  ],
  pendingOrders: [],
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.mocked(api.fetchDashboard).mockResolvedValue(mockStats)
  })

  it('renders stat cards with correct values', async () => {
    render(<Dashboard />)
    expect(await screen.findByText('12')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('Total Prescriptions')).toBeInTheDocument()
    expect(screen.getByText('Total Orders')).toBeInTheDocument()
  })

  it('renders pending prescription rows', async () => {
    render(<Dashboard />)
    expect(await screen.findByText('Alice Smith')).toBeInTheDocument()
    expect(screen.getByText('RX001')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    vi.mocked(api.fetchDashboard).mockReturnValue(new Promise(() => {}))
    render(<Dashboard />)
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('shows error when API fails', async () => {
    vi.mocked(api.fetchDashboard).mockRejectedValue(new Error('network'))
    render(<Dashboard />)
    expect(await screen.findByText(/Could not load dashboard/)).toBeInTheDocument()
  })
})
