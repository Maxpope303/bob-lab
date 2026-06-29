import React, { useEffect, useState } from 'react'
import { fetchDashboard } from '../api/pharmacyApi'
import type { DashboardStats } from '../api/types'

const StatCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, padding: '20px 24px', flex: 1 }}>
    <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
    <div style={{ color: '#57606a', marginTop: 4 }}>{label}</div>
  </div>
)

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboard()
      .then(setStats)
      .catch(() => setError('Could not load dashboard — is the pharmacy backend running?'))
  }, [])

  if (error) return <p style={{ color: '#c0392b' }}>{error}</p>
  if (!stats) return <p style={{ color: '#57606a' }}>Loading…</p>

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Dashboard</h1>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Prescriptions" value={stats.totalPrescriptions} color="#3b82d4" />
        <StatCard label="Total Orders" value={stats.totalOrders} color="#7c5cd8" />
        <StatCard label="Pending Prescriptions" value={stats.pendingPrescriptions.length} color="#e67e22" />
        <StatCard label="Pending Orders" value={stats.pendingOrders.length} color="#27ae60" />
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Pending Prescriptions</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, marginBottom: 24 }}>
        <thead>
          <tr style={{ background: '#f7f8fa', borderBottom: '1px solid #e5e7eb' }}>
            {['ID', 'Patient', 'Medicine', 'Qty', 'Doctor'].map(h => (
              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: 13 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stats.pendingPrescriptions.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 12 }}>{p.id}</td>
              <td style={{ padding: '8px 12px' }}>{p.patientName}</td>
              <td style={{ padding: '8px 12px' }}>{p.medicineName}</td>
              <td style={{ padding: '8px 12px' }}>{p.quantity}</td>
              <td style={{ padding: '8px 12px' }}>{p.doctorName}</td>
            </tr>
          ))}
          {stats.pendingPrescriptions.length === 0 && (
            <tr><td colSpan={5} style={{ padding: '12px', color: '#57606a' }}>No pending prescriptions</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
