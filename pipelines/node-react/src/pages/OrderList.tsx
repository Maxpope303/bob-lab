import React, { useEffect, useState } from 'react'
import { fetchOrders, processPayment, collectOrder } from '../api/pharmacyApi'
import type { Order } from '../api/types'

const statusColour: Record<string, string> = {
  PENDING: '#e67e22',
  VALIDATED: '#3b82d4',
  PAID: '#7c5cd8',
  COLLECTED: '#27ae60',
  CANCELLED: '#c0392b',
}

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = () => fetchOrders().then(setOrders).catch(() => setError('Could not load orders'))

  useEffect(() => { load() }, [])

  const handlePayment = async (id: string) => {
    await processPayment(id, 'CASH').catch(() => setError('Payment failed'))
    load()
  }

  const handleCollect = async (id: string) => {
    await collectOrder(id).catch(() => setError('Collect failed'))
    load()
  }

  if (error) return <p style={{ color: '#c0392b' }}>{error}</p>

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Orders</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6 }}>
        <thead>
          <tr style={{ background: '#f7f8fa', borderBottom: '1px solid #e5e7eb' }}>
            {['ID', 'Patient', 'Medicine', 'Qty', 'Total', 'Status', 'Actions'].map(h => (
              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: 13 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 12 }}>{o.id}</td>
              <td style={{ padding: '8px 12px' }}>{o.patientName}</td>
              <td style={{ padding: '8px 12px' }}>{o.medicineName}</td>
              <td style={{ padding: '8px 12px' }}>{o.quantity}</td>
              <td style={{ padding: '8px 12px' }}>${o.totalAmount.toFixed(2)}</td>
              <td style={{ padding: '8px 12px' }}>
                <span style={{ background: statusColour[o.status] + '22', color: statusColour[o.status], padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                  {o.status}
                </span>
              </td>
              <td style={{ padding: '8px 12px', display: 'flex', gap: 6 }}>
                {o.status === 'VALIDATED' && (
                  <button onClick={() => handlePayment(o.id)} style={{ padding: '4px 10px', background: '#7c5cd8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                    Pay
                  </button>
                )}
                {o.status === 'PAID' && (
                  <button onClick={() => handleCollect(o.id)} style={{ padding: '4px 10px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                    Collect
                  </button>
                )}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr><td colSpan={7} style={{ padding: '12px', color: '#57606a' }}>No orders found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
