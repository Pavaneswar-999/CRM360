import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const user = {
  id: 'demo-user',
  name: 'Morgan Lee',
  email: 'morgan@example.test',
  role: 'Admin' as const,
  active: true,
}

const teammate = {
  id: 'teammate-1',
  name: 'Avery Chen',
  email: 'avery@example.test',
  role: 'Sales Executive' as const,
  active: true,
}

const dashboard = {
  metrics: { totalCustomers: 2, activeLeads: 1, pendingTasks: 1, wonDeals: 0, lostDeals: 0, wonDealValue: 0 },
  leadsByStage: [
    { _id: 'New', count: 1, value: 2400 },
    { _id: 'Contacted', count: 0, value: 0 },
    { _id: 'Qualified', count: 0, value: 0 },
    { _id: 'Proposal Sent', count: 0, value: 0 },
    { _id: 'Won', count: 0, value: 0 },
    { _id: 'Lost', count: 0, value: 0 },
  ],
  tasksByStatus: [{ _id: 'Pending', count: 1 }],
  recentActivity: [{ _id: 'activity-1', type: 'lead_created', description: 'Created a lead for Northstar Studio', createdAt: '2026-08-02T08:00:00.000Z', actor: user }],
  dueSoon: [{ _id: 'task-1', title: 'Confirm the next meeting', description: 'Follow up with the buyer', status: 'Pending', priority: 'High', dueDate: '2026-08-03T08:00:00.000Z', assignedTo: user }],
  focusQueue: { overdueTasks: 0, overdueFollowUps: 0, noActivity: 1 },
}

async function mockSignedOut(page: Page) {
  await page.route('**/api/auth/refresh', (route) => route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ success: false, error: 'No session' }) }))
}

async function mockSignedIn(page: Page) {
  await page.route('**/api/auth/refresh', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data: { user, token: 'test-token' } }) }))
  await page.route('**/api/notifications*', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data: { items: [], unreadCount: 0 } }) }))
  await page.route('**/api/dashboard', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data: dashboard }) }))
  await page.route('**/api/customers*', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data: { items: [], pagination: { page: 1, limit: 50, total: 0, pages: 0 } } }) }))
  await page.route('**/api/users', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data: { users: [user, teammate] } }) }))
  await page.route('**/api/leads*', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data: { items: [], pagination: { page: 1, limit: 50, total: 0, pages: 0 } } }) }))
  await page.route('**/api/tasks*', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data: { items: [{ _id: 'task-2', title: 'Confirm the handoff', description: 'Share the next action with Avery', status: 'Pending', priority: 'Medium', dueDate: '2026-08-03T08:00:00.000Z', assignedTo: user }], pagination: { page: 1, limit: 100, total: 1, pages: 1 } } }) }))
}

async function expectNoSeriousAxeIssues(page: Page) {
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact || ''))).toEqual([])
}

test('landing keeps its real product story visible and routes each workflow action distinctly', async ({ page }) => {
  await mockSignedOut(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /every relationship/i })).toBeVisible()
  await expect(page.getByRole('img', { name: 'Abstract connected record planes' })).toBeVisible()
  await page.getByRole('heading', { name: /less hunting for context/i }).scrollIntoViewIfNeeded()
  await expect(page.getByRole('heading', { name: /less hunting for context/i })).toBeVisible()

  const routes = await page.locator('.story-link').evaluateAll((links) => links.map((link) => link.getAttribute('href')))
  expect(new Set(routes).size).toBe(4)
  expect(routes).toEqual(expect.arrayContaining([
    '/register?next=%2Fapp%2Fleads',
    '/register?next=%2Fapp%2Fcustomers',
    '/register?next=%2Fapp%2Ftasks',
    '/register?next=%2Fapp%2Fpipeline',
  ]))
})

test('sign-in form remains a labelled, usable form', async ({ page }) => {
  await mockSignedOut(page)
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  await expect(page.getByLabel('Work email')).toBeVisible()
  const password = page.getByRole('textbox', { name: 'Password' })
  await expect(password).toHaveAttribute('type', 'password')
  await page.getByRole('button', { name: 'Show password' }).click()
  await expect(password).toHaveAttribute('type', 'text')
})

test('dashboard renders actual-work controls rather than a decorative overview', async ({ page }) => {
  await mockSignedIn(page)
  await page.goto('/app')
  await expect(page.getByRole('heading', { name: /here is what needs attention/i })).toBeVisible()
  await expect(page.getByText('Confirm the next meeting')).toBeVisible()
  await expect(page.getByRole('link', { name: /open tasks/i })).toHaveAttribute('href', '/app/tasks')
  await page.getByRole('link', { name: /open tasks/i }).click()
  await expect(page).toHaveURL(/\/app\/tasks$/)
})

test('customers has a useful zero-data action', async ({ page }) => {
  await mockSignedIn(page)
  await page.goto('/app/customers')
  await expect(page.getByRole('heading', { name: 'Customers', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Add customer' }).first().click()
  await expect(page.getByRole('dialog', { name: 'Add customer' })).toBeVisible()
})

test('managers can assign leads and tasks, and task status is a real control', async ({ page }) => {
  await mockSignedIn(page)
  await page.goto('/app/leads')
  await page.getByRole('button', { name: 'Create lead' }).first().click()
  await expect(page.getByLabel('Assign to')).toBeVisible()
  await page.getByLabel('Assign to').selectOption(teammate.id)

  await page.goto('/app/tasks')
  await expect(page.getByLabel('Change status for Confirm the handoff')).toHaveValue('Pending')
  await page.getByRole('button', { name: 'Add task' }).click()
  await expect(page.getByLabel('Assign to')).toBeVisible()
  await page.getByLabel('Assign to').selectOption(teammate.id)
})

test('landing keeps its hierarchy at supported widths', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Run the width matrix once in Chromium.')
  await mockSignedOut(page)

  for (const viewport of [
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1024, height: 900 },
    { width: 1440, height: 1000 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /every relationship/i })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Create your workspace' })).toBeVisible()
  }
})

test('key screens have no automatically detectable serious accessibility issues', async ({ page }) => {
  await mockSignedOut(page)
  await page.goto('/')
  await expectNoSeriousAxeIssues(page)

  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  await expectNoSeriousAxeIssues(page)
})

test('command and customer screens have no automatically detectable serious accessibility issues', async ({ page }) => {
  await mockSignedIn(page)
  await page.goto('/app')
  await expect(page.getByRole('heading', { name: /here is what needs attention/i })).toBeVisible()
  await expectNoSeriousAxeIssues(page)

  await page.goto('/app/customers')
  await expect(page.getByRole('heading', { name: 'Customers', exact: true })).toBeVisible()
  await expectNoSeriousAxeIssues(page)
})
