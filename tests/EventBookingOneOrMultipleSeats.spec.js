const { test, expect } = require("@playwright/test");

const email = "SB@gmail.com";
const baseUrl = "https://eventhub.rahulshettyacademy.com";
async function loginAndGoToBooking(page) {
    await page.goto(baseUrl);
    // Login
    await page.getByPlaceholder("you@email.com").fill(email);
    await page.getByLabel("password").fill("saB#0808%TM");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByRole("link", { name: "Browse Events →" })).toBeVisible();
}
async function step1(page) {

}
async function fill_bookingform(page) {

    await page.getByLabel("Full Name").fill("Sham Pandey");
    await page.locator("#customer-email").fill(email);
    await page.getByPlaceholder("+91 98765 43210").fill("98765 43210");
    await page.locator(".confirm-booking-btn").click();
}

test("Test 1 — Single ticket booking is eligible for refund", async ({ page }) => {

    //Step 1-Login
    await loginAndGoToBooking(page);

    /**
     * Step 2- Book first event with 1 ticket (default)
     *  - Navigate to /events
        - Click Book Now on the very first event card (locate data-testid="event-card" → first →
     data-testid="book-now-btn")
        - Fill Full Name, Email (your email), Phone
        - Click confirm button (.confirm-booking-btn)
     */
    const events = page.getByRole("link", { name: "Events" });
    await events.nth(0).click();

    const eventCard = page.getByTestId("event-card");
    await eventCard.first().waitFor();

    await eventCard.first().getByTestId("book-now-btn").click();

    await expect(page.locator("#ticket-count").filter({ hasText: '1' })).toBeTruthy();

    await fill_bookingform(page);

    /**
     * Step 3 — Navigate to booking detail
    - Click View My Bookings link
    - Assert URL is /bookings
    - Click the first View Details link
    - Assert: text Booking Information is visible on the page
     */
    //verify booking conformation
    const bookingref = await page.locator(".booking-ref").textContent();
    console.log(bookingref);

    //Verify in My Bookings
    await page.getByRole("link", { name: "View My Bookings" }).click();
    await expect(page).toHaveURL(baseUrl + '/bookings');

    const bookingcards = await page.getByTestId("booking-card");
    await bookingcards.first().getByRole("button", { name: "View Details" }).click()

    await expect(page.getByText(bookingref).nth(0)).toBeVisible();

    /**
     * Step 4 — Validate booking ref
    - Read booking ref from page
    - Read event title from h1
    - Assert validation : "first character of booking ref equals first character of event title"
     */

    const view_bookingref = await page.getByText(bookingref).nth(1).textContent();

    const book_eventtitle = await page.locator("h1").textContent();
    await expect(view_bookingref.charAt(0)).toEqual(book_eventtitle[0]);

    /**
     * Step 5 — Check refund eligibility
    - Click the Check Refund Eligibility button
    - Assert: spinner element (#refund-spinner) is immediately visible
    - Assert: spinner is no longer visible within 6 seconds
     */
    await page.getByRole("button", { name: "Check eligibility for refund?" }).click();
    const spinnerrefund = page.locator("#refund-spinner");
    await expect(spinnerrefund).toBeVisible();
    await expect(spinnerrefund).toBeVisible({ timeout: 6000 });

    /**
     * Step 6 — Validate result
    - Locate result element by id #refund-result
    - Assert it is visible
    - Assert it contains text Eligible for refund
    - Assert it contains text Single-ticket bookings qualify for a full refund
     */

    const refundresult = page.locator("#refund-result");
    await expect(refundresult).toBeVisible();
    const refundtext = await refundresult.textContent();
    await expect(refundtext).toContain("Eligible for refund");
    await expect(refundtext).toContain("Single-ticket bookings qualify for a full refund");
})

test("Test 2 — Group ticket booking is NOT eligible for refund", async ({ page }) => {

    /**
     * Steps 1–2 — Same as Test 1, except after navigating to the event detail page, click the + button twice to increase quantity to 3 before filling the form
    - Locate the increment button with button:has-text("+") and click it twice
     */
    //step1-
    await loginAndGoToBooking(page);
    //step 2
    const events = page.getByRole("link", { name: "Events" });
    await events.nth(0).click();

    const eventCard = page.getByTestId("event-card");
    await eventCard.first().waitFor();

    await eventCard.first().getByTestId("book-now-btn").click();

    await page.locator('button:has-text("+")').click();
    await page.getByRole("button", { name: '+' }).click();

    await fill_bookingform(page);

    //step 3
    const bookingref = await page.locator(".booking-ref").textContent();
    console.log(bookingref);

    //Verify in My Bookings
    await page.getByRole("link", { name: "View My Bookings" }).click();
    await expect(page).toHaveURL(baseUrl + '/bookings');

    const bookingcards = await page.getByTestId("booking-card");
    await bookingcards.first().getByRole("button", { name: "View Details" }).click()

    await expect(page.getByText(bookingref).nth(0)).toBeVisible();

    //step 4
    const view_bookingref = await page.getByText(bookingref).nth(1).textContent();

    const book_eventtitle = await page.locator("h1").textContent();
    await expect(view_bookingref.charAt(0)).toEqual(book_eventtitle[0]);

    /**
     * Step 5 — Check refund eligibility
    - Click the Check Refund Eligibility button
     */
    await page.getByRole("button", { name: "Check eligibility for refund?" }).click();
    const spinnerrefund = page.locator("#refund-spinner");
    await expect(spinnerrefund).toBeVisible({ timeout: 6000 });

    /**
     * Step 6 — Validate result (different assertions)
     * - Assert result contains Not eligible for refund
     * - Assert result contains Group bookings (3 tickets) are non-refundable
     */

    const refundresult = page.locator("#refund-result");
    await expect(refundresult).toBeVisible();
    const refundtext = await refundresult.textContent();
    await expect(refundtext).toContain("Not eligible for refund");
    await expect(refundtext).toContain("Group bookings (3 tickets) are non-refundable");
})