import React, { useEffect, useState } from 'react'
import { fetchMedicines, searchMedicines } from '../api/pharmacyApi'
import type { Medicine } from '../api/types'

export default function MedicineList() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMedicines()
      .then(setMedicines)
      .catch(() => setError('Could not load medicines'))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      searchMedicines(query).then(setMedicines).catch(() => setError('Search failed'))
    } else {
      fetchMedicines().then(setMedicines).catch(() => setError('Could not load medicines'))
    }
  }

  if (error) return <p style={{ color: '#c0392b' }}>{error}</p>

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Medicines</h1>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name…"
          style={{ flex: 1, padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: 4, fontSize: 14 }}
        />
        <button type="submit" style={{ padding: '6px 16px', background: '#3b82d4', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Search
        </button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6 }}>
        <thead>
          <tr style={{ background: '#f7f8fa', borderBottom: '1px solid #e5e7eb' }}>
            {['ID', 'Name', 'Description', 'Price', 'Stock', 'Manufacturer'].map(h => (
              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: 13 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {medicines.map(m => (
            <tr key={m.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 12 }}>{m.id}</td>
              <td style={{ padding: '8px 12px', fontWeight: 500 }}>{m.name}</td>
              <td style={{ padding: '8px 12px', color: '#57606a' }}>{m.description}</td>
              <td style={{ padding: '8px 12px' }}>${m.price.toFixed(2)}</td>
              <td style={{ padding: '8px 12px' }}>{m.stockQuantity}</td>
              <td style={{ padding: '8px 12px' }}>{m.manufacturer}</td>
            </tr>
          ))}
          {medicines.length === 0 && (
            <tr><td colSpan={6} style={{ padding: '12px', color: '#57606a' }}>No medicines found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
