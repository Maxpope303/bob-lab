import React, { useEffect, useState } from 'react'
import { fetchPrescriptions, validatePrescription } from '../api/pharmacyApi'
import type { Prescription } from '../api/types'

const statusColour: Record<string, string> = {
  PENDING: '#e67e22',
  VALIDATED: '#3b82d4',
  FULFILLED: '#27ae60',
  EXPIRED: '#c0392b',
}

export default function PrescriptionList() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = () => fetchPrescriptions().then(setPrescriptions).catch(() => setError('Could not load prescriptions'))

  useEffect(() => { load() }, [])

  const handleValidate = async (id: string) => {
    await validatePrescription(id).catch(() => setError('Validation failed'))
    load()
  }

  if (error) return <p style={{ color: '#c0392b' }}>{error}</p>

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Prescriptions</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6 }}>
        <thead>
          <tr style={{ background: '#f7f8fa', borderBottom: '1px solid #e5e7eb' }}>
            {['ID', 'Patient', 'Doctor', 'Medicine', 'Qty', 'Status', 'Action'].map(h => (
              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: 13 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {prescriptions.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 12 }}>{p.id}</td>
              <td style={{ padding: '8px 12px' }}>{p.patientName}</td>
              <td style={{ padding: '8px 12px' }}>{p.doctorName}</td>
              <td style={{ padding: '8px 12px' }}>{p.medicineName}</td>
              <td style={{ padding: '8px 12px' }}>{p.quantity}</td>
              <td style={{ padding: '8px 12px' }}>
                <span style={{ background: statusColour[p.status] + '22', color: statusColour[p.status], padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                  {p.status}
                </span>
              </td>
              <td style={{ padding: '8px 12px' }}>
                {p.status === 'PENDING' && (
                  <button onClick={() => handleValidate(p.id)} style={{ padding: '4px 12px', background: '#3b82d4', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                    Validate
                  </button>
                )}
              </td>
            </tr>
          ))}
          {prescriptions.length === 0 && (
            <tr><td colSpan={7} style={{ padding: '12px', color: '#57606a' }}>No prescriptions found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
