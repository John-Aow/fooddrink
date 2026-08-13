# Implementation Plan — Food Ordering Web

## Phase 1: Foundation

- แทนที่ Vite starter ด้วย app shell และ route/view state สำหรับ menu, cart และ orders
- เพิ่ม types, mock seed data และ i18n dictionary ไทย/อังกฤษ
- วาง service interface ที่มี mock implementation และ API implementation placeholder

## Phase 2: Table session and shared state

- อ่าน `table` และ `session` จาก URL
- ตรวจสอบ open/closed session ใน mock service
- สร้าง localStorage repository สำหรับ session, cart และ orders
- sync ระหว่างแท็บด้วย `storage` event

## Phase 3: Menu and cart

- สร้าง header, table banner, language switcher และ category list
- สร้าง menu card แบบ 2 คอลัมน์
- เพิ่ม quantity controls, unavailable state และ note editor
- สร้าง floating cart bar และ cart view

## Phase 4: Order flow

- สร้าง order confirmation view
- submit order, clear cart และ success feedback
- แสดง order list เรียงจากล่าสุดไปเก่าสุด
- แสดง status badge และ bill total

## Phase 5: QA

- ตรวจ responsive บน viewport มือถือและ iPad
- ตรวจ empty/error/closed-table states
- ตรวจภาษาไทย/อังกฤษและความยาวข้อความ
- รัน `npm run lint` และ `npm run build`

## Backend handoff

รายละเอียด endpoint, module, event และ data ownership อยู่ที่ [Backend API Overview](../../docs/backend-api.md)
