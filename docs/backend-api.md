# Backend/API Overview สำหรับระบบสั่งอาหารในร้าน

เอกสารนี้อธิบายภาพรวม backend สำหรับผู้ที่ไม่ได้อ่าน Product Spec โดยตรง จุดประสงค์คือให้ทีม frontend, backend, ร้านค้า และผู้ดูแลระบบเข้าใจว่าระบบจริงต้องมีส่วนประกอบอะไรบ้าง

## ภาพรวมแบบง่าย

```text
QR Code ประจำโต๊ะ
        ↓
Table Session Service ── เปิด/ปิดโต๊ะและออก token ใหม่
        ↓
Customer Web App ─────── ดูเมนู / ใช้ cart ร่วม / ส่ง order
        ↓
Order Service ────────── รวม order เข้า bill เดียวของโต๊ะ
        ↓
Kitchen/Staff System ─── เปลี่ยนสถานะแต่ละ order
        ↓
Customer Web App ─────── เห็นสถานะล่าสุดแบบ real-time
```

## โหมดการทำงานในช่วงแรก

Frontend เริ่มด้วย `debug=true` และ mock data:

- ไม่เรียก backend จริง
- ใช้ service interface เดียวกับ production API
- เก็บข้อมูลไว้ใน `localStorage`
- จำลอง table session, shared cart, bill และ order status
- เมื่อพร้อมเชื่อมระบบจริง ให้เปลี่ยน service factory เป็น API mode

การทำ mock นี้ใช้ได้สำหรับพัฒนา UI และ flow เท่านั้น การแชร์ข้ามอุปกรณ์จริงต้องใช้ backend และ real-time transport

## Modules ที่ backend ต้องมี

### 1. Table Session Module

รับผิดชอบการเปิดโต๊ะ ปิดโต๊ะ ออก QR/session token ใหม่ และตรวจว่า link ยังใช้งานได้หรือไม่

กติกาหลัก:

- เปิดโต๊ะทุกครั้งต้องได้ session ใหม่
- session เก่าต้องใช้ไม่ได้เมื่อปิดโต๊ะ
- ลูกค้าอ่าน table number ได้จาก session ที่ valid
- ลูกค้าไม่มีสิทธิ์เปิดหรือปิดโต๊ะเอง

### 2. Menu Module

จัดการหมวดหมู่ เมนู ราคา รูปภาพ รายละเอียด และสถานะพร้อมสั่ง

- เมนูหมดต้องยังอ่านข้อมูลได้ แต่ `available=false`
- การตรวจ available ต้องทำซ้ำที่ server ตอนสร้าง order
- รองรับภาษาไทยและอังกฤษ

### 3. Shared Cart/Session Module

ดูแล cart ที่ผูกกับ table session เดียวกัน กรณีหลายอุปกรณ์ในโต๊ะเดียวกัน

- cart เป็นข้อมูลชั่วคราวก่อน submit
- เปลี่ยนแปลงแล้วต้อง broadcast ให้ client อื่น
- note อยู่ในระดับ cart item
- เมื่อ submit แล้ว cart ชุดนั้นต้องถูกเปลี่ยนเป็น order และแก้ไม่ได้

หมายเหตุ: ใน production อาจเลือกไม่ persist cart ทุกครั้งก็ได้ แต่ต้องมี concurrency policy ที่ชัดเจน

### 4. Order Module

สร้างและอ่าน order โดยแต่ละการกดยืนยันเป็น order แยก แต่ผูกกับ bill/table session เดียวกัน

สถานะ:

```text
pending → preparing → served
pending/preparing → cancelled
```

การแก้ไขสถานะทำได้จาก staff/kitchen เท่านั้น ลูกค้าอ่านสถานะได้อย่างเดียว

### 5. Bill Module

รวม order ทั้งหมดของ table session เป็นบิลเดียว คำนวณ subtotal/total และส่งยอดให้ customer อ่านได้

- ยังไม่รับชำระเงินออนไลน์
- การปิดโต๊ะเป็น business action ของร้าน
- order ที่ cancelled ต้องมี policy ว่าจะไม่นับใน payable total แต่ยังคงอยู่ในประวัติ

### 6. Real-time Module

กระจายการเปลี่ยนแปลงของ cart และ order status ไปยังทุกอุปกรณ์ที่อยู่ใน table session เดียวกัน

แนะนำให้ใช้ WebSocket หรือ Server-Sent Events โดยมี event อย่างน้อย:

```text
table.session.updated
cart.updated
order.created
order.status_changed
bill.updated
```

## REST API ที่ควรเตรียมไว้

Base path ตัวอย่าง: `/api/v1`

### Table session

| Method | Endpoint | ใช้ทำอะไร |
|---|---|---|
| GET | `/table-sessions/{sessionId}` | ตรวจ session และอ่านหมายเลขโต๊ะ |
| POST | `/tables/{tableId}/sessions` | เปิดโต๊ะและสร้าง session ใหม่ (staff) |
| POST | `/table-sessions/{sessionId}/close` | ปิดโต๊ะและทำให้ QR session ใช้ไม่ได้ (staff) |

### Menu

| Method | Endpoint | ใช้ทำอะไร |
|---|---|---|
| GET | `/menu/categories?locale=th` | อ่านหมวดหมู่ |
| GET | `/menu/items?locale=th&categoryId=...` | อ่านรายการเมนูทั้งหมด/ตามหมวด |
| GET | `/menu/items/{itemId}?locale=th` | อ่านรายละเอียดเมนูหนึ่งรายการ |

### Shared cart

| Method | Endpoint | ใช้ทำอะไร |
|---|---|---|
| GET | `/table-sessions/{sessionId}/cart` | อ่าน cart กลางของโต๊ะ |
| PUT | `/table-sessions/{sessionId}/cart/items/{itemId}` | เพิ่ม/แก้จำนวนและ note |
| DELETE | `/table-sessions/{sessionId}/cart/items/{itemId}` | ลบรายการจาก cart ก่อน submit |
| DELETE | `/table-sessions/{sessionId}/cart` | ล้าง cart หลัง submit/ตาม policy |

### Orders and bill

| Method | Endpoint | ใช้ทำอะไร |
|---|---|---|
| GET | `/table-sessions/{sessionId}/orders` | อ่าน order ทั้งหมดของโต๊ะ |
| POST | `/table-sessions/{sessionId}/orders` | ยืนยัน cart และสร้าง order ใหม่ |
| GET | `/table-sessions/{sessionId}/bill` | อ่านยอดรวมบิลของโต๊ะ |
| GET | `/orders/{orderId}` | อ่านรายละเอียด order เดียว |
| PATCH | `/orders/{orderId}/status` | เปลี่ยนสถานะโดย staff/kitchen เท่านั้น |

### Real-time connection

ตัวเลือกแนะนำ:

```text
GET /api/v1/table-sessions/{sessionId}/events
```

อาจ implement เป็น SSE ในช่วงแรก หรือ WebSocket หากต้องการ bidirectional messaging

## ตัวอย่าง request/response สำคัญ

### สร้าง order

```json
POST /api/v1/table-sessions/session_abc/orders
{
  "items": [
    { "menuItemId": "pad-thai", "quantity": 2, "note": "ไม่ใส่ถั่ว" },
    { "menuItemId": "thai-tea", "quantity": 1, "note": "หวานน้อย" }
  ]
}
```

```json
{
  "order": {
    "id": "order_1002",
    "status": "pending",
    "items": [
      { "menuItemId": "pad-thai", "quantity": 2, "unitPrice": 85, "lineTotal": 170, "note": "ไม่ใส่ถั่ว" },
      { "menuItemId": "thai-tea", "quantity": 1, "unitPrice": 45, "lineTotal": 45, "note": "หวานน้อย" }
    ],
    "total": 215,
    "createdAt": "2026-08-13T10:00:00Z"
  },
  "billTotal": 515
}
```

## สิทธิ์และความปลอดภัย

- QR/session token ต้องสุ่มเดายากและหมดอายุเมื่อปิดโต๊ะ
- customer token อ่านได้เฉพาะ session/bill/order ของโต๊ะนั้น
- customer ห้ามเรียก endpoint เปลี่ยน order status
- server ต้องตรวจ session status, menu availability และราคาเองทุกครั้งที่สร้าง order
- ห้ามเชื่อราคา/ยอดรวมจาก client
- ควรมี idempotency key สำหรับ submit order เพื่อป้องกันการกดซ้ำหรือ network retry สร้าง order ซ้ำ
- log การเปิดโต๊ะ ปิดโต๊ะ สร้าง order และเปลี่ยนสถานะ

## สิ่งที่ยังต้องตัดสินใจก่อน production

- ระบบ staff/kitchen ที่จะเป็นผู้เปลี่ยน order status
- วิธี authentication ของ staff
- database และ transaction policy ตอนหลายอุปกรณ์แก้ cart พร้อมกัน
- วิธี real-time: SSE หรือ WebSocket
- ภาษี service charge และกติกายอดบิลจริง
- retention ของข้อมูล session/cart/order
- การรองรับ reconnect เมื่อมือถือหลุด network
- policy เมื่อเมนูหมดในจังหวะเดียวกับการกดยืนยัน
