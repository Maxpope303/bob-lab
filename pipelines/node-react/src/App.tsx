import React from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import MedicineList from './pages/MedicineList'
import PrescriptionList from './pages/PrescriptionList'
import OrderList from './pages/OrderList'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh' }}>
        <nav style={{ background: '#1f2328', padding: '12px 24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 700, marginRight: 16 }}>Pharmacy</span>
          {[
            { to: '/', label: 'Dashboard' },
            { to: '/medicines', label: 'Medicines' },
            { to: '/prescriptions', label: 'Prescriptions' },
            { to: '/orders', label: 'Orders' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                color: isActive ? '#3b82d4' : '#adb5bd',
                textDecoration: 'none',
                fontSize: 14,
              })}
              end
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <main style={{ padding: '32px 24px', maxWidth: 960, margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/medicines" element={<MedicineList />} />
            <Route path="/prescriptions" element={<PrescriptionList />} />
            <Route path="/orders" element={<OrderList />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
