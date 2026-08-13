import type { MenuCategory, MenuItem, Order, TableSession } from '../types'

export const categories: MenuCategory[] = [
  { id: 'all', nameTh: 'ทั้งหมด', nameEn: 'All' },
  { id: 'recommended', nameTh: 'เมนูแนะนำ', nameEn: 'Recommended' },
  { id: 'main', nameTh: 'อาหารจานหลัก', nameEn: 'Main dishes' },
  { id: 'snack', nameTh: 'ของทานเล่น', nameEn: 'Snacks' },
  { id: 'drink', nameTh: 'เครื่องดื่ม', nameEn: 'Drinks' },
]

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`

export const menuItems: MenuItem[] = [
  { id: 'pad-thai', categoryId: 'main', nameTh: 'ผัดไทยกุ้งสด', nameEn: 'Pad Thai with prawns', descriptionTh: 'เส้นจันท์เหนียวนุ่ม ผัดซอสสูตรพิเศษ', descriptionEn: 'Rice noodles with our signature sauce', imageUrl: img('photo-1559314809-0d155014e29e'), price: 120, available: true },
  { id: 'green-curry', categoryId: 'recommended', nameTh: 'แกงเขียวหวานไก่', nameEn: 'Green curry with chicken', descriptionTh: 'เครื่องแกงหอมละมุน กะทิเข้มข้น', descriptionEn: 'Aromatic curry with rich coconut cream', imageUrl: img('photo-1601050690597-df0568f70950'), price: 150, available: true },
  { id: 'tom-yum', categoryId: 'recommended', nameTh: 'ต้มยำกุ้ง', nameEn: 'Tom Yum Goong', descriptionTh: 'ต้มยำรสจัดจ้าน กุ้งสดตัวโต', descriptionEn: 'Spicy and fragrant soup with prawns', imageUrl: img('photo-1547592180-85f173990554'), price: 180, available: true },
  { id: 'crispy-chicken', categoryId: 'main', nameTh: 'ไก่ทอดซอสเผ็ด', nameEn: 'Crispy spicy chicken', descriptionTh: 'ไก่ทอดกรอบคลุกซอสเผ็ดหวาน', descriptionEn: 'Crispy chicken tossed in sweet chili sauce', imageUrl: img('photo-1527477396000-e27163b481c2'), price: 110, available: true },
  { id: 'spring-rolls', categoryId: 'snack', nameTh: 'ปอเปี๊ยะทอด', nameEn: 'Crispy spring rolls', descriptionTh: 'ปอเปี๊ยะผักทอดกรอบ เสิร์ฟพร้อมน้ำจิ้ม', descriptionEn: 'Crispy vegetable rolls with dipping sauce', imageUrl: img('photo-1548507200-2b86c8b8a4d7'), price: 90, available: true },
  { id: 'mango-sticky', categoryId: 'snack', nameTh: 'ข้าวเหนียวมะม่วง', nameEn: 'Mango sticky rice', descriptionTh: 'มะม่วงสุกหวานกับข้าวเหนียวมูน', descriptionEn: 'Sweet mango with coconut sticky rice', imageUrl: img('photo-1621293954908-907159247fc8'), price: 95, available: false },
  { id: 'thai-tea', categoryId: 'drink', nameTh: 'ชาไทยเย็น', nameEn: 'Iced Thai tea', descriptionTh: 'ชาไทยหอมเข้ม หวานกำลังดี', descriptionEn: 'Rich Thai tea, lightly sweetened', imageUrl: img('photo-1556679343-c7306c1976bc'), price: 55, available: true },
  { id: 'lime-soda', categoryId: 'drink', nameTh: 'มะนาวโซดา', nameEn: 'Lime soda', descriptionTh: 'สดชื่นซาบซ่า เปรี้ยวหวานลงตัว', descriptionEn: 'Refreshing sparkling lime drink', imageUrl: img('photo-1513558161293-cdaf765ed2fd'), price: 60, available: true },
]

export const defaultSession = (id: string, tableNumber: string): TableSession => ({ id, tableNumber, status: 'open', openedAt: new Date().toISOString() })

export const seedOrders: Order[] = [
  { id: 'order-1001', items: [{ menuItemId: 'green-curry', quantity: 1, note: '', nameTh: 'แกงเขียวหวานไก่', nameEn: 'Green curry with chicken', unitPrice: 150, lineTotal: 150 }], total: 150, status: 'preparing', createdAt: new Date(Date.now() - 18 * 60_000).toISOString() },
  { id: 'order-1000', items: [{ menuItemId: 'thai-tea', quantity: 2, note: 'หวานน้อย', nameTh: 'ชาไทยเย็น', nameEn: 'Iced Thai tea', unitPrice: 55, lineTotal: 110 }], total: 110, status: 'served', createdAt: new Date(Date.now() - 42 * 60_000).toISOString() },
]
