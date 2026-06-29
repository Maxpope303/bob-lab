import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import MedicineList from '../../pages/MedicineList'
import * as api from '../../api/pharmacyApi'

vi.mock('../../api/pharmacyApi')

const mockMedicines = [
  { id: 'MED001', name: 'Amoxicillin 500mg', description: 'Antibiotic', price: 15.99, stockQuantity: 100, manufacturer: 'PharmaCorp' },
  { id: 'MED002', name: 'Lisinopril 10mg', description: 'Blood pressure', price: 12.50, stockQuantity: 150, manufacturer: 'HealthMeds' },
]

describe('MedicineList', () => {
  beforeEach(() => {
    vi.mocked(api.fetchMedicines).mockResolvedValue(mockMedicines)
    vi.mocked(api.searchMedicines).mockResolvedValue([mockMedicines[0]])
  })

  it('renders medicine table on load', async () => {
    render(<MedicineList />)
    expect(await screen.findByText('Amoxicillin 500mg')).toBeInTheDocument()
    expect(screen.getByText('Lisinopril 10mg')).toBeInTheDocument()
  })

  it('shows correct price formatting', async () => {
    render(<MedicineList />)
    expect(await screen.findByText('$15.99')).toBeInTheDocument()
    expect(screen.getByText('$12.50')).toBeInTheDocument()
  })

  it('calls searchMedicines when search submitted', async () => {
    render(<MedicineList />)
    await screen.findByText('Amoxicillin 500mg')
    fireEvent.change(screen.getByPlaceholderText('Search by name…'), { target: { value: 'Amox' } })
    fireEvent.click(screen.getByText('Search'))
    await waitFor(() => expect(api.searchMedicines).toHaveBeenCalledWith('Amox'))
  })
})
