const {  test, request, expect } = require("@playwright/test");
const loginpayload={email: "S@gmail.com", password: "sa08%"};
let token;
const SIX_EVENTS_RESPONSE = {
  data: [
    { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
    { id: 2, title: 'Rock Night Live',  category: 'Concert',    eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
    { id: 3, title: 'IPL Finals',       category: 'Sports',     eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
    { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
    { id: 5, title: 'Lollapalooza India', category: 'Festival', eventDate: '2025-06-20T12:00:00.000Z', venue: 'Mahalaxmi Racecourse', city: 'Mumbai', price: '3000', totalSeats: 5000, availableSeats: 2000, imageUrl: null, isStatic: false },
    { id: 6, title: 'AI & ML Expo',    category: 'Conference',  eventDate: '2025-06-25T10:00:00.000Z', venue: 'Bangalore International Exhibition Centre', city: 'Bangalore', price: '750', totalSeats: 300, availableSeats: 180, imageUrl: null, isStatic: false },
  ],
  pagination: { page: 1, totalPages: 1, total: 6, limit: 12 },
};
 
 
const FOUR_EVENTS_RESPONSE = {
  data: [
    { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
    { id: 2, title: 'Rock Night Live',  category: 'Concert',    eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
    { id: 3, title: 'IPL Finals',       category: 'Sports',     eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
    { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
  ],
  pagination: { page: 1, totalPages: 1, total: 4, limit: 12 },
};
 
 async function loginAndGoToEvents(page) {
    
    await page.goto("https://eventhub.rahulshettyacademy.com/");
    await page.getByPlaceholder("you@email.com").fill("SB@gmail.com");
    await page.getByLabel("password").fill("saB#0808%TM");
    await page.getByRole("button",{name:"Sign In"}).click();
    
    await page.waitForLoadState("networkidle");
    await page.getByTestId("nav-events").click();
 }
test("Test 1 — Banner IS visible when 6 events are returned",async({page})=>{
    
    await page.route("**/api/events**",async route=>{
        
        let body=JSON.stringify(SIX_EVENTS_RESPONSE);
        route.fulfill({
            status:200,
            contentType:'application/json',
            body
        })
 
    })    ;
    
    await loginAndGoToEvents(page);
    const cards=page.getByTestId("event-card");
    await expect(cards.first()).toBeVisible();
    await expect(cards).toHaveCount(6);
 
 
    const banner=await page.getByText(        /sandbox holds up to/i    );
    await expect(banner).toBeVisible();
    await expect(banner).toContainText("9 bookings");
    // await page.pause();
})
 
test("Test 2 — Banner is NOT visible when 4 events are returned", async({page})=>{
    await page.route("**/api/events**", async route=>{
        const card4body=JSON.stringify(FOUR_EVENTS_RESPONSE);
        await route.fulfill({
            status:200,
            contentType:'application/json',
            body: card4body
        })
    })
    
    await loginAndGoToEvents(page);
    
    const cards=page.locator('[data-testid="event-card"]');
    await expect(cards.first()).toBeVisible();
    await expect(cards).toHaveCount(4);
    
    const banner=await page.getByText(/sandbox holds up to/i );
    await expect(banner).not.toBeVisible();
})