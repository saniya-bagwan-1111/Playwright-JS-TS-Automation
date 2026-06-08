const { test, expect, request } = require('@playwright/test');

// Setup Constants
const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL = `${BASE_URL}/api`;

// const YAHOO_USER = { email: 'dummy_yahoo@yahoo.com', password: 'Password123!' };
// const GMAIL_USER = { email: 'dummy_gmail@gmail.com', password: 'Password123!' };

const GMAIL_USER={email: "S@gmail.com", password: "sa08%"};
const YAHOO_USER={email: "BA@yahoo.com", password: "King$Wisdom%0808"};

// Dummy helper function for Step 4 (UI Login)
async function loginAs(page, user) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE_URL}/dashboard`); // Adjust based on actual post-login landing URL
}

test('API-UI Hybrid Authorization Security Test', async ({ page }) => {
  // Create an isolated API request context
  const apiContext = await request.newContext();

  // ----------------------------------------------------
  // Step 1 — Login as Yahoo user via API
  // ----------------------------------------------------
  const loginRes = await apiContext.post(`${API_URL}/auth/login`, {
    data: {
      email: YAHOO_USER.email,
      password: YAHOO_USER.password
    }
  });
  console.log("Status Code:", loginRes.status());
console.log("Error Body:", await loginRes.text());
  
  expect(loginRes.ok()).toBeTruthy();
  const loginJson = await loginRes.json();
  const token = loginJson.token; // Adjusted based on common API structures

  // ----------------------------------------------------
  // Step 2 — Fetch events via API to get a valid event ID
  // ----------------------------------------------------
  const eventsRes = await apiContext.get(`${API_URL}/events`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  expect(eventsRes.ok()).toBeTruthy();
  const eventsJson = await eventsRes.json();
  const eventId = eventsJson.data[0].id;

  // ----------------------------------------------------
  // Step 3 — Create a booking via API as Yahoo user
  // ----------------------------------------------------
  const bookingRes = await apiContext.post(`${API_URL}/bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    data: {
      eventId: eventId,
      customerName: 'Yahoo User',
      customerEmail: YAHOO_USER.email,
      customerPhone: '1234567890',
      quantity: 1
    }
  });

  expect(bookingRes.ok()).toBeTruthy();
  const bookingJson = await bookingRes.json();
  const yahooBookingId = bookingJson.data.id;

  // Dispose the API context since API steps are done
  await apiContext.dispose();

  // ----------------------------------------------------
  // Step 4 — Login as Gmail user via browser UI
  // ----------------------------------------------------
  await loginAs(page, GMAIL_USER);

  // ----------------------------------------------------
  // Step 5 — Navigate to Yahoo's booking URL as Gmail user
  // ----------------------------------------------------
  await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`, { 
    waitUntil: 'networkidle' 
  });

  // ----------------------------------------------------
  // Step 6 — Validate Access Denied
  // ----------------------------------------------------
  const accessDeniedHeading = page.locator('text=Access Denied');
  const unauthorizedMessage = page.locator('text=You are not authorized to view this booking');

  await expect(accessDeniedHeading).toBeVisible();
  await expect(unauthorizedMessage).toBeVisible();
});