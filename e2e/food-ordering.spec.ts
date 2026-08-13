import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?table=12&session=e2e-session')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('customer can add an available menu item and submit an order', async ({ page }) => {
  await page.getByRole('button', { name: /เพิ่ม ผัดไทยกุ้งสด/ }).click()
  await expect(page.getByRole('button', { name: /ดูตะกร้า/ })).toContainText('1')
  await page.getByRole('button', { name: /ดูตะกร้า/ }).click()
  await page.getByRole('button', { name: /ตรวจสอบและยืนยัน/ }).click()
  await page.getByRole('button', { name: /ยืนยันส่งออเดอร์/ }).click()
  await expect(page.getByText('ส่งออเดอร์เรียบร้อยแล้ว')).toBeVisible()
})

test('closed table cannot place an order', async ({ page }) => {
  await page.goto('/?table=12&session=closed-session&status=closed')
  await expect(page.getByText('โต๊ะนี้ปิดแล้ว')).toBeVisible()
})
