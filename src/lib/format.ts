import type { Locale, OrderStatus } from '../types'

export const translate = (locale: Locale, thai: string, english: string) => locale === 'th' ? thai : english

export const formatMoney = (value: number) => `฿${value.toLocaleString('th-TH')}`

export const formatOrderStatus = (status: OrderStatus, locale: Locale) => ({
  pending: translate(locale, 'รอรับออเดอร์', 'Waiting'),
  preparing: translate(locale, 'กำลังเตรียม', 'Preparing'),
  served: translate(locale, 'เสิร์ฟแล้ว', 'Served'),
  cancelled: translate(locale, 'ยกเลิก', 'Cancelled'),
}[status])
