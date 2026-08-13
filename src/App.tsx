import { useEffect, useMemo, useState } from 'react'
import { categories, menuItems } from './data/mock'
import { createOrder, getCart, getOrders, getSession, saveCart } from './services/mockService'
import type { CartItem, Locale, MenuItem, Order } from './types'
import { EmptyState } from './components/EmptyState'
import { MenuCard } from './components/MenuCard'
import { formatMoney, formatOrderStatus, translate } from './lib/format'
import './App.css'

const t = translate
const money = formatMoney
const statusText = formatOrderStatus

function App() {
  const params = new URLSearchParams(window.location.search)
  const sessionId = params.get('session') || 'demo-session'
  const tableNumber = params.get('table') || '12'
  const sessionFromStorage = getSession(sessionId, tableNumber)
  const forceClosed = params.get('status') === 'closed' || params.get('closed') === 'true'
  const session = forceClosed ? { ...sessionFromStorage, status: 'closed' as const } : sessionFromStorage
  const [locale, setLocale] = useState<Locale>('th')
  const [view, setView] = useState<'menu' | 'cart' | 'orders'>('menu')
  const [category, setCategory] = useState('all')
  const [cart, setCart] = useState<CartItem[]>(() => getCart(sessionId))
  const [orders, setOrders] = useState<Order[]>(() => getOrders(sessionId))
  const [noteId, setNoteId] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    const sync = () => { setCart(getCart(sessionId)); setOrders(getOrders(sessionId)) }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [sessionId])

  const visibleItems = useMemo(() => category === 'all' ? menuItems : menuItems.filter((item) => item.categoryId === category), [category])
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + (menuItems.find((menu) => menu.id === item.menuItemId)?.price || 0) * item.quantity, 0)
  const billTotal = orders.filter((order) => order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0)
  const updateCart = (next: CartItem[]) => { setCart(next); saveCart(sessionId, next) }

  const addItem = (item: MenuItem) => {
    if (!item.available || session.status === 'closed') return
    const found = cart.find((cartItem) => cartItem.menuItemId === item.id)
    updateCart(found ? cart.map((cartItem) => cartItem.menuItemId === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem) : [...cart, { menuItemId: item.id, quantity: 1, note: '' }])
  }
  const changeQuantity = (id: string, amount: number) => updateCart(cart.map((item) => item.menuItemId === id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0))
  const openNote = (item: CartItem) => { setNoteId(item.menuItemId); setNote(item.note) }
  const saveNote = () => { if (noteId) updateCart(cart.map((item) => item.menuItemId === noteId ? { ...item, note: note.trim().slice(0, 200) } : item)); setNoteId(null) }
  const submitOrder = () => { if (!cart.length || session.status === 'closed') return; createOrder(sessionId, cart); setCart([]); setOrders(getOrders(sessionId)); setConfirming(false); setFeedback(translate(locale, 'ส่งออเดอร์เรียบร้อยแล้ว', 'Order sent successfully')); setView('menu'); window.setTimeout(() => setFeedback(''), 3000) }

  if (session.status === 'closed') return <div className="closed"><div className="closed-mark">×</div><h1>{translate(locale, 'โต๊ะนี้ปิดแล้ว', 'This table is closed')}</h1></div>

  return <div className="app-shell">
    <header className="topbar"><div className="brand"><div className="brand-mark">F</div><div><strong>FOOD<span>DRINK</span></strong><small>{translate(locale, 'สั่งอาหารที่โต๊ะ', 'Dine-in ordering')}</small></div></div><div className="header-actions"><div className="table-pill">{translate(locale, 'โต๊ะ', 'Table')} {session.tableNumber}</div><button className="language" onClick={() => setLocale(locale === 'th' ? 'en' : 'th')}>{locale === 'th' ? 'EN' : 'TH'}</button></div></header>
    <main>
      <div className="page-heading"><div><p className="eyebrow">{translate(locale, 'ยินดีต้อนรับ', 'WELCOME')}</p><h1>{translate(locale, 'เลือกเมนูที่คุณชอบ', 'Choose your favorites')}</h1></div><div className="live-dot"><i /> {translate(locale, 'โต๊ะพร้อมสั่ง', 'Table is open')}</div></div>
      {feedback && <div className="toast">✓ {feedback}</div>}
      {view === 'menu' && <><div className="category-list">{categories.map((item) => <button key={item.id} className={category === item.id ? 'active' : ''} onClick={() => setCategory(item.id)}>{locale === 'th' ? item.nameTh : item.nameEn}</button>)}</div><div className="menu-grid">{visibleItems.map((item) => <MenuCard key={item.id} item={item} locale={locale} quantity={cart.find((entry) => entry.menuItemId === item.id)?.quantity || 0} onAdd={() => addItem(item)} onChange={(amount) => changeQuantity(item.id, amount)} />)}</div></>}
      {view === 'cart' && <CartView cart={cart} locale={locale} total={cartTotal} onChange={changeQuantity} onNote={openNote} onConfirm={() => setConfirming(true)} />}
      {view === 'orders' && <OrdersView orders={orders} locale={locale} billTotal={billTotal} />}
    </main>
    {cartCount > 0 && <button className="cart-bar" onClick={() => setView('cart')}><span className="cart-icon">🛒</span><span>{translate(locale, 'ดูตะกร้า', 'View cart')} <b>{cartCount}</b></span><strong>{formatMoney(cartTotal)}</strong><span>›</span></button>}
    <nav className="bottom-nav"><button className={view === 'menu' ? 'selected' : ''} onClick={() => setView('menu')}><span>▦</span>{translate(locale, 'เมนูอาหาร', 'Menu')}</button><button className={view === 'cart' ? 'selected' : ''} onClick={() => setView('cart')}><span>🛒{cartCount > 0 && <em>{cartCount}</em>}</span>{translate(locale, 'ตะกร้า', 'Cart')}</button><button className={view === 'orders' ? 'selected' : ''} onClick={() => setView('orders')}><span>☷</span>{translate(locale, 'ออเดอร์ของโต๊ะ', 'Table orders')}</button></nav>
    {noteId && <div className="modal-backdrop"><div className="modal"><button className="close" onClick={() => setNoteId(null)}>×</button><h2>{translate(locale, 'เพิ่มหมายเหตุ', 'Add a note')}</h2><p>{translate(locale, 'แจ้งรายละเอียดเพิ่มเติมสำหรับเมนูนี้', 'Add a special request for this item')}</p><textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={200} placeholder={translate(locale, 'เช่น ไม่ใส่ผักชี', 'e.g. No coriander')} /><button className="primary full" onClick={saveNote}>{translate(locale, 'บันทึก', 'Save note')}</button></div></div>}
    {confirming && <div className="modal-backdrop"><div className="modal confirm"><button className="close" onClick={() => setConfirming(false)}>×</button><h2>{translate(locale, 'ยืนยันการสั่งอาหาร', 'Confirm your order')}</h2><p>{translate(locale, 'กรุณาตรวจสอบรายการก่อนยืนยัน เมื่อส่งแล้วจะไม่สามารถแก้ไขหรือลบได้', 'Please review your order. Once sent, it cannot be edited or deleted.')}</p><div className="confirm-total"><span>{translate(locale, 'ยอดรวม', 'Total')}</span><strong>{formatMoney(cartTotal)}</strong></div><button className="primary full" onClick={submitOrder}>{translate(locale, 'ยืนยันส่งออเดอร์', 'Send order')}</button><button className="secondary full" onClick={() => setConfirming(false)}>{translate(locale, 'กลับไปแก้ไข', 'Back to edit')}</button></div></div>}
  </div>
}

function CartView({ cart, locale, total, onChange, onNote, onConfirm }: { cart: CartItem[]; locale: Locale; total: number; onChange: (id: string, amount: number) => void; onNote: (item: CartItem) => void; onConfirm: () => void }) {
  return <section className="content-section"><div className="section-title"><div><p className="eyebrow">{t(locale, 'โต๊ะเดียวกัน สั่งร่วมกัน', 'SHARED TABLE CART')}</p><h2>{t(locale, 'ตะกร้าของคุณ', 'Your cart')}</h2></div></div>{cart.length === 0 ? <EmptyState locale={locale} text={t(locale, 'ยังไม่มีรายการในตะกร้า', 'Your cart is empty')} /> : <><div className="cart-list">{cart.map((item) => { const menu = menuItems.find((entry) => entry.id === item.menuItemId)!; return <div className="cart-row" key={item.menuItemId}><img src={menu.imageUrl} alt="" /><div className="cart-detail"><h3>{locale === 'th' ? menu.nameTh : menu.nameEn}</h3>{item.note && <p>✎ {item.note}</p>}<button className="note-link" onClick={() => onNote(item)}>✎ {item.note ? t(locale, 'แก้ไข note', 'Edit note') : t(locale, 'เพิ่ม note', 'Add note')}</button></div><div className="cart-side"><strong>{money(menu.price * item.quantity)}</strong><div className="quantity"><button onClick={() => onChange(item.menuItemId, -1)}>−</button><b>{item.quantity}</b><button onClick={() => onChange(item.menuItemId, 1)}>+</button></div></div></div> })}</div><div className="order-total"><span>{t(locale, 'ยอดรวม', 'Total')}</span><strong>{money(total)}</strong></div><button className="primary full" onClick={onConfirm}>{t(locale, 'ตรวจสอบและยืนยัน', 'Review and confirm')} →</button></>}</section>
}

function OrdersView({ orders, locale, billTotal }: { orders: Order[]; locale: Locale; billTotal: number }) { return <section className="content-section"><div className="section-title"><div><p className="eyebrow">{t(locale, 'รายการทั้งหมดของโต๊ะ', 'ALL TABLE ORDERS')}</p><h2>{t(locale, 'ออเดอร์ของโต๊ะ', 'Table orders')}</h2></div></div><div className="bill-card"><span>{t(locale, 'ยอดรวมทั้งบิล', 'Bill total')}</span><strong>{money(billTotal)}</strong><small>{t(locale, 'ชำระภายหลังกับพนักงาน', 'Pay later with staff')}</small></div>{orders.length === 0 ? <EmptyState locale={locale} text={t(locale, 'ยังไม่มีออเดอร์', 'No orders yet')} /> : <div className="orders-list">{orders.map((order, index) => <article className="order-card" key={order.id}><div className="order-head"><div><strong>Order #{order.id.split('-')[1]}</strong><small>{index === 0 ? t(locale, 'ล่าสุด', 'Latest') : new Date(order.createdAt).toLocaleTimeString(locale === 'th' ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</small></div><span className={`status ${order.status}`}>{statusText(order.status, locale)}</span></div>{order.items.map((item) => <div className="order-item" key={item.menuItemId}><span>{item.quantity}× {locale === 'th' ? item.nameTh : item.nameEn}{item.note && <small>✎ {item.note}</small>}</span><strong>{money(item.lineTotal)}</strong></div>)}<div className="order-footer"><span>{t(locale, 'รวมออเดอร์', 'Order total')}</span><strong>{money(order.total)}</strong></div></article>)}</div>}</section> }
export default App
