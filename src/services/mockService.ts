import { defaultSession, seedOrders, menuItems } from '../data/mock'
import type { CartItem, Order, TableSession } from '../types'

const prefix = 'fooddrink:'
const read = <T,>(key: string, fallback: T): T => {
  const value = localStorage.getItem(prefix + key)
  if (!value) { localStorage.setItem(prefix + key, JSON.stringify(fallback)); return fallback }
  return JSON.parse(value) as T
}
const write = <T,>(key: string, value: T) => localStorage.setItem(prefix + key, JSON.stringify(value))

export const getSession = (sessionId: string, tableNumber: string): TableSession => read(`session:${sessionId}`, defaultSession(sessionId, tableNumber))
export const getCart = (sessionId: string): CartItem[] => read(`cart:${sessionId}`, [])
export const getOrders = (sessionId: string): Order[] => read(`orders:${sessionId}`, seedOrders)
export const saveCart = (sessionId: string, cart: CartItem[]) => write(`cart:${sessionId}`, cart)
export const saveOrders = (sessionId: string, orders: Order[]) => write(`orders:${sessionId}`, orders)

export const createOrder = (sessionId: string, cart: CartItem[]): Order => {
  const items = cart.map((cartItem) => {
    const menuItem = menuItems.find((item) => item.id === cartItem.menuItemId)!
    return { ...cartItem, nameTh: menuItem.nameTh, nameEn: menuItem.nameEn, unitPrice: menuItem.price, lineTotal: menuItem.price * cartItem.quantity }
  })
  const order = { id: `order-${Date.now()}`, items, total: items.reduce((sum, item) => sum + item.lineTotal, 0), status: 'pending' as const, createdAt: new Date().toISOString() }
  saveOrders(sessionId, [order, ...getOrders(sessionId)])
  saveCart(sessionId, [])
  return order
}
