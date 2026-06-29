import axios from 'axios'
import { API_BASE, DashboardStats, Medicine, Order, Prescription } from './types'

const client = axios.create({ baseURL: API_BASE })

export async function fetchDashboard(): Promise<DashboardStats> {
  const { data } = await client.get<DashboardStats>('/dashboard.action')
  return data
}

export async function fetchMedicines(): Promise<Medicine[]> {
  const { data } = await client.get<Medicine[]>('/medicine-list.action')
  return data
}

export async function searchMedicines(name: string): Promise<Medicine[]> {
  const { data } = await client.get<Medicine[]>('/medicine-search.action', { params: { name } })
  return data
}

export async function fetchPrescriptions(): Promise<Prescription[]> {
  const { data } = await client.get<Prescription[]>('/prescription-list.action')
  return data
}

export async function createPrescription(p: Omit<Prescription, 'id' | 'status'>): Promise<void> {
  await client.post('/prescription-save.action', p)
}

export async function validatePrescription(id: string): Promise<void> {
  await client.post('/prescription-validate.action', { id })
}

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await client.get<Order[]>('/order-list.action')
  return data
}

export async function processPayment(orderId: string, paymentMethod: string): Promise<void> {
  await client.post('/order-processPayment.action', { orderId, paymentMethod })
}

export async function collectOrder(orderId: string): Promise<void> {
  await client.post('/order-collect.action', { orderId })
}
