# FoodDrink SPA

Mobile-first React SPA สำหรับสั่งอาหารผ่าน QR code ประจำโต๊ะ รองรับเมนู ตะกร้าร่วม ออเดอร์ และภาษาไทย/อังกฤษ โดยค่าเริ่มต้นใช้ mock service และ `localStorage`.

## Commands

```bash
npm run dev                 # development server
npm run build               # typecheck + production build
npm run lint                # Oxlint
npm run storybook           # component development at :6006
npm run test:e2e            # Playwright smoke tests
npm run test:e2e:install    # install Chromium once per machine
```

ตัวอย่าง URL: `/?table=12&session=demo-session` และใช้ `&status=closed` เพื่อจำลองโต๊ะปิด

## Architecture

- `src/app` และ `src/App.tsx`: application composition และ view state ของ SPA
- `src/components`: UI components ที่แยกทดสอบและทำ Storybook ได้
- `src/lib`: pure functions เช่น translation และ formatting
- `src/services`: service boundary สำหรับ mock/API implementation
- `e2e`: user-flow tests ที่ Playwright มองผ่าน browser จริง
- `specs`: product และ quality requirements

หลักการสำคัญคือ component รับข้อมูลและ callback ผ่าน props, business logic อยู่ใน service/lib, หลีกเลี่ยง side effect ใน presentational component และใช้ accessible role/label เป็น contract ของ E2E test.
