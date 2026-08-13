# Frontend SPA Architecture

## Scope

FoodDrink เป็น client-side SPA สำหรับ customer ordering flow เดียว ไม่มี server-side routing ในระยะแรก โดย session ถูกระบุจาก query string (`table`, `session`) และ state ถูกแบ่งเป็น `menu`, `cart`, `orders` ภายใน app shell.

## Clean-code boundaries

1. Presentational components (`src/components`) ไม่อ่าน `window`, `localStorage` หรือ data source โดยตรง
2. Pure formatting/i18n logic อยู่ใน `src/lib`
3. Persistence และ order creation อยู่หลัง service boundary (`src/services`)
4. `App` ทำหน้าที่ orchestration และส่ง props/callback ลงมา
5. ทุก user flow ที่สำคัญต้องมี accessible label และ Playwright coverage

## Quality gates

- `npm run lint`
- `npm run build`
- `npm run storybook -- --smoke-test`
- `npm run test:e2e`

Storybook ใช้พัฒนา/ตรวจ visual states ของ component เช่น available และ unavailable menu card ส่วน Playwright ใช้ตรวจ flow ระดับผู้ใช้ เช่น เพิ่มสินค้า ส่ง order และโต๊ะปิด.
