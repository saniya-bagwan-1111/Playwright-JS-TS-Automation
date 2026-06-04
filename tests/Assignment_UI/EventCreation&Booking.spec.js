const { test, expect } = require("@playwright/test");

function futureDateValue() {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Adds 7 days to the current date

    // Format to local ISO format: YYYY-MM-DDTHH:mm
    const YYYY = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const DD = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');

    return `${YYYY}-${MM}-${DD}T${HH}:${mm}`;
}
test("Booking with Event Creation", async ({ page }) => {

    const email = "SB@gmail.com";
    const eventTitle = `Test Event- ${Date.now()}`;
    const baseUrl="https://eventhub.rahulshettyacademy.com";

    await page.goto(baseUrl);
    // Login
    await page.getByPlaceholder("you@email.com").fill(email);
    // await page.locator("#password").fill("saB#0808%TM");

    await page.getByLabel("password").fill("saB#0808%TM");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByRole("link", { name: "Browse Events →" })).toBeVisible();

    //Create a new event
    await page.getByRole("button", { name: "Admin" }).click();
    await page.getByRole("link", { name: "Manage Events" }).nth(0).click();


    await page.getByTestId("event-title-input").fill(eventTitle);
    await page.getByTestId("admin-event-form").locator("textarea").fill("Test event with description");

    await page.getByLabel("city").fill("Pune");
    await page.getByLabel("venue").fill("Shivaji Nagar");

    //1-way
    const dateInput = await page.getByRole("textbox", { name: "Event Date & Time" });
    await dateInput.click();
    await dateInput.pressSequentially("2026-07-12T09:00");

    //2-way -seprate  method for date creation
    // const futureDate = futureDateValue(); 
    // await page.locator('#event-date-\\&-time').fill(futureDate);

    //     const futureDate = futureDateValue(); 
    //   await page.locator('#event-date-\\&-time').fill(futureDate);

    // 3. FIXED: Avoid rigid label text evaluation; use regex targeting for the price field
    // This bypasses strict character match issues with brackets or hidden characters
    const priceInput = page.getByLabel(/price/i);
    await priceInput.scrollIntoViewIfNeeded(); // Ensures the input is visible on screen
    await priceInput.fill("100");

    const totalSeat = page.getByLabel("Total Seats");
    await totalSeat.scrollIntoViewIfNeeded();
    await totalSeat.fill("10");

    await page.getByTestId("add-event-btn").click();

    await expect(page.getByText("Event created!")).toBeVisible();

    //Find the event card and capture seats
    const events=page.getByRole("link", { name: "Events" });
    await events.nth(1).click();

    await page.getByTestId("event-card").first().waitFor();

    const all_cards = await page.getByTestId("event-card").allTextContents();
    console.log(all_cards);

    //filtering newly created event cart
    const eventCard=page.getByTestId("event-card");
    await expect( eventCard.filter({hasText:eventTitle})).toBeVisible();

    const Seatsinfobefore=await page.getByText('seats left!').first().textContent();
    const seatsBeforeBooking=Seatsinfobefore.split(" ");
    console.log("Before booking seats",Number(seatsBeforeBooking[0]));

    // Start booking
    await eventCard.filter({hasText:eventTitle}).getByTestId("book-now-btn").click();
    //Fill booking form 
    await expect(page.locator("#ticket-count").filter({hasText:'1'})).toBeTruthy();
    
    // await page.getByRole("button",{name:'+'}).click();

    await page.getByLabel("Full Name").fill("Sham Pandey");
    await page.locator("#customer-email").fill(email);
    await page.getByPlaceholder("+91 98765 43210").fill("98765 43210");
    await page.locator(".confirm-booking-btn").click();

    //verify booking conformation
     const bookingref=await page.locator(".booking-ref").textContent();
    console.log(bookingref);
    //Verify in My Bookings
    await page.getByRole("link",{name:"View My Bookings"}).click();

    await expect(page).toHaveURL(baseUrl+'/bookings');

    const bookingcards=await page.getByTestId("booking-card");
    await expect(bookingcards.first()).toBeVisible();

    
    await expect( bookingcards.getByText(bookingref)).toBeVisible();
    await expect(bookingcards.locator("h3").filter({hasText:eventTitle})).toBeTruthy();

    //seat reduction
    await events.nth(1).click();
    await eventCard.first().isVisible();

    await expect(eventCard.filter({hasText:eventTitle})).toBeVisible();
    
    const Seatsinfoafter=await page.getByText('seats left!').first().textContent();
    const seatsAfterBooking=Seatsinfoafter.split(" ");
    console.log("After booking seats", Number(seatsAfterBooking[0]));

    await expect(Number(seatsAfterBooking)).toEqual(Number(seatsBeforeBooking)-1);


    // await page.pause();

})