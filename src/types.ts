export type Locale = 'th' | 'en'
export type OrderStatus = 'pending' | 'preparing' | 'served' | 'cancelled'

export type MenuCategory = { id: string; nameTh: string; nameEn: string }
export type MenuItem = {
  id: string; categoryId: string; nameTh: string; nameEn: string
  descriptionTh: string; descriptionEn: string; imageUrl: string
  price: number; available: boolean
}
export type CartItem = { menuItemId: string; quantity: number; note: string }
export type OrderItem = CartItem & { nameTh: string; nameEn: string; unitPrice: number; lineTotal: number }
export type Order = { id: string; items: OrderItem[]; total: number; status: OrderStatus; createdAt: string }
export type TableSession = { id: string; tableNumber: string; status: 'open' | 'closed'; openedAt: string }
