// Base URL for pharmacy backend REST API
// Proxied through Vite dev server in development; set VITE_API_BASE_URL in production
export const API_BASE = '/api'

export interface Medicine {
  id: string
  name: string
  description: string
  price: number
  stockQuantity: number
  manufacturer: string
}

export interface Prescription {
  id: string
  patientName: string
  patientId: string
  doctorName: string
  medicineId: string
  medicineName: string
  quantity: number
  dosage: string
  prescriptionDate: string
  expiryDate: string
  status: 'PENDING' | 'VALIDATED' | 'FULFILLED' | 'EXPIRED'
  notes: string
}

export interface Order {
  id: string
  prescriptionId: string
  patientName: string
  patientId: string
  medicineId: string
  medicineName: string
  quantity: number
  totalAmount: number
  orderDate: string
  status: 'PENDING' | 'VALIDATED' | 'PAID' | 'COLLECTED' | 'CANCELLED'
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'INSURANCE'
  pharmacistNotes: string
}

export interface DashboardStats {
  totalPrescriptions: number
  totalOrders: number
  pendingPrescriptions: Prescription[]
  pendingOrders: Order[]
}
