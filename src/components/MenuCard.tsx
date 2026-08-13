import type { Locale, MenuItem } from '../types'
import { formatMoney, translate } from '../lib/format'

type MenuCardProps = {
  item: MenuItem
  locale: Locale
  quantity: number
  onAdd: () => void
  onChange: (amount: number) => void
}

export function MenuCard({ item, locale, quantity, onAdd, onChange }: MenuCardProps) {
  const name = locale === 'th' ? item.nameTh : item.nameEn

  return <article className={`menu-card ${!item.available ? 'unavailable' : ''}`} data-testid={`menu-card-${item.id}`}>
    <div className="food-image"><img src={item.imageUrl} alt={name} />{!item.available && <span>{translate(locale, 'หมดชั่วคราว', 'Unavailable')}</span>}</div>
    <div className="menu-info"><h3>{name}</h3><p>{locale === 'th' ? item.descriptionTh : item.descriptionEn}</p><div className="card-bottom"><strong>{formatMoney(item.price)}</strong>{quantity === 0 ? <button aria-label={`${translate(locale, 'เพิ่ม', 'Add')} ${name}`} disabled={!item.available} className="add-button" onClick={onAdd}>+</button> : <div className="quantity"><button aria-label={`${translate(locale, 'ลด', 'Decrease')} ${name}`} onClick={() => onChange(-1)}>−</button><b>{quantity}</b><button aria-label={`${translate(locale, 'เพิ่ม', 'Increase')} ${name}`} onClick={() => onChange(1)}>+</button></div>}</div></div>
  </article>
}
