import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuCard } from './MenuCard'

const meta = {
  title: 'Menu/MenuCard',
  component: MenuCard,
  args: { locale: 'th', quantity: 0, onAdd: () => undefined, onChange: () => undefined },
} satisfies Meta<typeof MenuCard>

export default meta
type Story = StoryObj<typeof meta>

export const Available: Story = { args: { item: { id: 'demo', categoryId: 'main', nameTh: 'ผัดไทยกุ้งสด', nameEn: 'Pad Thai with prawns', descriptionTh: 'เส้นจันท์เหนียวนุ่ม', descriptionEn: 'Rice noodles with prawns', imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=600&q=80', price: 120, available: true } } }
export const Unavailable: Story = { args: { item: { id: 'sold-out', categoryId: 'snack', nameTh: 'ข้าวเหนียวมะม่วง', nameEn: 'Mango sticky rice', descriptionTh: 'หมดชั่วคราว', descriptionEn: 'Temporarily unavailable', imageUrl: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?auto=format&fit=crop&w=600&q=80', price: 95, available: false } } }
