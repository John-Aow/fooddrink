# Food Ordering Web — Product Specification

สถานะ: Draft พร้อมเริ่มพัฒนา frontend mock mode  
ขอบเขต: หน้าลูกค้าสำหรับสั่งอาหารในร้านผ่าน QR Code ประจำโต๊ะ  
โหมดเริ่มต้น: `debug=true` และใช้ mock data ผ่าน `localStorage`

## 1. เป้าหมาย

สร้างหน้าเว็บ mobile-first สำหรับลูกค้านั่งในร้านเพื่อดูเมนู เลือกจำนวน เพิ่ม note ส่ง order และติดตามสถานะ order ของโต๊ะ โดยลูกค้าหลายคนที่โต๊ะเดียวกันใช้บิลร่วมกัน แต่การส่งแต่ละครั้งเป็น order แยกที่มีสถานะของตัวเอง

ไม่มีการชำระเงินออนไลน์ ลูกค้าชำระภายหลังกับร้าน

## 2. ผู้ใช้และข้อจำกัด

- ผู้ใช้คือลูกค้าที่สแกน QR Code จากโต๊ะ
- ไม่ต้อง login และไม่ต้องกรอกชื่อผู้สั่ง
- รองรับมือถือและ iPad เท่านั้น
- ภาษาเริ่มต้นคือไทย และสลับเป็นอังกฤษได้ด้วย `TH / EN`
- ใช้โทนสีแดงเป็น primary color
- ชื่อร้านและโลโก้ใช้ mock asset ในรอบแรก

## 3. Session โต๊ะ

QR link ต้องมีข้อมูล session ของโต๊ะ เช่น `?table=12&session=...` โดย mock mode จะอ่านค่าจาก URL และสร้าง/โหลด session จาก `localStorage`

เมื่อ session ใช้งานได้:

- แสดงชื่อร้าน/โลโก้ mock และหมายเลขโต๊ะชัดเจน
- ลูกค้าหลายคนที่ใช้ session เดียวกันเห็น cart และ bill ร่วมกัน
- ลูกค้าสั่งเพิ่มได้จนกว่าโต๊ะจะถูกปิด

เมื่อ session ถูกปิดหรือหมดอายุ:

- แสดงข้อความ `โต๊ะนี้ปิดแล้ว`
- ไม่ให้เพิ่มรายการหรือส่ง order
- ไม่ต้องมี flow อื่นเพิ่มเติม

## 4. โครงสร้างหน้าหลัก

### 4.1 Header

- โลโก้และชื่อร้าน mock
- หมายเลขโต๊ะ เช่น `โต๊ะ 12`
- ปุ่มสลับภาษา `TH / EN`

### 4.2 Navigation หลัก

มี navigation สำหรับ:

- `เมนูอาหาร`
- `ตะกร้า`
- `ออเดอร์ของโต๊ะ`

### 4.3 หน้าเมนูอาหาร

- แสดงรายการหมวดหมู่ไว้ด้านบนเป็นรายการแนวนอน/แถวด้านบนแบบไม่ใช้ horizontal tab carousel
- มีตัวเลือก `ทั้งหมด`
- ไม่มีช่องค้นหา
- รายการอาหารเป็น grid 2 คอลัมน์
- รองรับการเลื่อนดูเมนูบนมือถือและ iPad

การ์ดเมนูต้องมี:

- รูปภาพ
- ชื่อเมนู
- รายละเอียด
- ราคาเงินบาท (`฿`)
- ปุ่มเพิ่มรายการ/ตัวควบคุมจำนวน
- สถานะ `หมด` และปิดการสั่งเมื่อ unavailable
- ไอคอนดินสอสำหรับเพิ่มหรือแก้ไข note ของรายการ

### 4.4 Cart ร่วมของโต๊ะ

- แสดงเป็นแถบลอยด้านล่างตลอดเวลาที่มีรายการ
- แสดงจำนวนรายการและยอดรวม
- รายการใน cart รวมของผู้ใช้ทุกคนในโต๊ะเดียวกัน
- เพิ่ม/ลดจำนวนได้ก่อนยืนยัน
- แก้ไข note ผ่านไอคอนดินสอ
- ลบรายการได้ก่อนยืนยัน
- ห้ามแก้ไข order ที่ส่งแล้ว

### 4.5 หน้ายืนยัน order

ก่อนส่งต้องแสดงสรุป:

- รายการอาหาร
- จำนวน
- note ของแต่ละรายการ
- ยอดรวม
- คำเตือนว่าเมื่อยืนยันแล้วจะแก้ไขหรือลบไม่ได้ และต้องติดต่อพนักงาน
- ปุ่มยืนยันส่ง order และปุ่มย้อนกลับไปแก้ไข

เมื่อส่งสำเร็จ:

- สร้าง order ใหม่จากรายการใน cart
- รวมยอดเข้าบิลของโต๊ะ
- ล้างเฉพาะรายการใน cart ที่ส่งสำเร็จ
- กลับไปหน้า `เมนูอาหาร`
- แสดง feedback ว่าส่ง order สำเร็จ

### 4.6 หน้าออเดอร์ของโต๊ะ

- แสดง order ทั้งหมดของบิลโต๊ะเดียวกัน
- เรียงจากล่าสุดไปเก่าสุด
- แต่ละ order แสดงรายการ, จำนวน, note, ยอดรวม และสถานะ
- สถานะที่รองรับ:
  - `รอรับออเดอร์`
  - `กำลังเตรียม`
  - `เสิร์ฟแล้ว`
  - `ยกเลิก`
- แต่ละ order มีสถานะแยกจาก order อื่น แม้อยู่ในบิลเดียวกัน
- แสดงยอดรวมสะสมทั้งบิล
- ลูกค้าไม่มีสิทธิ์เปลี่ยนสถานะหรือยกเลิก order

## 5. Data model ฝั่ง frontend

```ts
type OrderStatus = 'pending' | 'preparing' | 'served' | 'cancelled'

type MenuCategory = {
  id: string
  nameTh: string
  nameEn: string
  sortOrder: number
}

type MenuItem = {
  id: string
  categoryId: string
  nameTh: string
  nameEn: string
  descriptionTh: string
  descriptionEn: string
  imageUrl: string
  price: number
  available: boolean
}

type CartItem = {
  menuItemId: string
  quantity: number
  note: string
}

type OrderItem = CartItem & {
  nameTh: string
  nameEn: string
  unitPrice: number
  lineTotal: number
}

type Order = {
  id: string
  tableSessionId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

type TableSession = {
  id: string
  tableNumber: string
  status: 'open' | 'closed'
  openedAt: string
  closedAt?: string
}
```

## 6. Mock mode และ localStorage

ตั้งค่าเริ่มต้นเป็น `debug=true` ผ่าน query/config ที่อ่านได้จาก frontend

เมื่อ debug mode เปิด:

- ไม่เรียก network API จริง
- ใช้ mock service ที่มี interface เดียวกับ API service
- เก็บ session, shared cart และ orders ใน `localStorage`
- ใช้ `storage` event เพื่อ sync การเปลี่ยนแปลงระหว่างแท็บใน browser เดียวกัน
- seed menu และตัวอย่าง order ที่มีหลายสถานะไว้แล้ว
- จำลอง table session จาก query string

แนะนำ key:

```text
fooddrink:config
fooddrink:table-session:{sessionId}
fooddrink:cart:{sessionId}
fooddrink:orders:{sessionId}
```

เมื่อ debug mode ปิด ให้เรียก service API จริงโดยไม่แก้ component และ business flow

## 7. Component/module structure ที่แนะนำ

```text
src/
├─ app/
│  ├─ App.tsx
│  └─ routes.ts
├─ components/
│  ├─ BrandHeader/
│  ├─ LanguageSwitcher/
│  ├─ TableBanner/
│  ├─ CategoryList/
│  ├─ MenuCard/
│  ├─ CartBar/
│  ├─ CartView/
│  ├─ OrderSummary/
│  ├─ OrderCard/
│  └─ EmptyState/
├─ features/
│  ├─ menu/
│  ├─ cart/
│  ├─ orders/
│  └─ table-session/
├─ services/
│  ├─ api/
│  ├─ mock/
│  └─ serviceFactory.ts
├─ types/
├─ data/mock/
└─ styles/
```

## 8. Acceptance criteria

- เปิดลิงก์ QR mock แล้วเห็นหมายเลขโต๊ะถูกต้อง
- โต๊ะปิดแล้วไม่สามารถสั่งได้และเห็นข้อความ `โต๊ะนี้ปิดแล้ว`
- เห็นเมนูทั้งหมดและกรองตามหมวดหมู่ด้านบนได้
- เมนูหมดแสดงสถานะหมดและกดเพิ่มไม่ได้
- เมนูแสดงแบบ 2 คอลัมน์บนมือถือและ iPad
- เพิ่ม/ลด/ลบรายการและเพิ่ม note ใน cart ได้
- cart แสดงเป็น shared state ระหว่างแท็บใน browser เดียวกัน
- หน้ายืนยันแสดงข้อมูลครบก่อนส่ง
- ส่ง order แล้วสร้าง order ใหม่ รวมเข้าบิล และกลับหน้าเมนู
- order ที่ส่งแล้วแก้ไขหรือลบไม่ได้
- หน้า order แสดง order ล่าสุดก่อน และสถานะแต่ละ order แยกกัน
- แสดงยอดรวมทั้งบิล
- สลับภาษาไทย/อังกฤษได้ และค่าเริ่มต้นเป็นไทย
- `npm run build` และ `npm run lint` ต้องผ่าน

## 9. ค่า default ที่ใช้เมื่อไม่ได้ระบุ

- สกุลเงิน: THB และแสดงด้วย `฿`
- จำนวนเริ่มต้นเมื่อกดเพิ่ม: 1
- จำนวนขั้นต่ำ: 1 และลบรายการด้วยปุ่มลบ
- note เป็น optional และจำกัดความยาว 200 ตัวอักษร
- เมนูหมดจะยังแสดงแต่ disabled
- order ที่ยกเลิกยังคงแสดงในประวัติและไม่ถูกนำออกจากบิลที่แสดงผล
- ใช้เวลาตาม ISO 8601 ใน data layer และจัดรูปแบบตาม locale ใน UI
- ใช้ red primary, neutral background, card radius และ touch target อย่างน้อย 44px
- รองรับ loading, empty และ error state แบบเรียบง่าย
