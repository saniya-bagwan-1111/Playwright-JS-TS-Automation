const {  test, request, expect } = require("@playwright/test");

//https://api.eventhub.rahulshettyacademy.com/api/auth/login
const BASE_URL = "https://api.eventhub.rahulshettyacademy.com";
const API_URL = `${BASE_URL}/api`;

const userAcc1Payload={email: "SB@gmail.com", password: "saB#0808%TM"};
const userAcc2Payload={email: "BA@yahoo.com", password: "King$Wisdom%0808"};

//API Documentation URL-https://api.eventhub.rahulshettyacademy.com/api/docs/

async function loginAs(page, userAcc1Payload){

     await page.goto("https://eventhub.rahulshettyacademy.com/");
    await page.getByPlaceholder("you@email.com").fill(userAcc1Payload.email);
    await page.getByLabel("password").fill(userAcc1Payload.password);
    await page.getByRole("button",{name:"Sign In"}).click();
    // await page.waitForLoadState("networkidle");
    await page.pause();
}
test("Unautorized booking access",async ({page})=>{

    const apiContext=await request.newContext();

    /**
     * Step 1 — Login as Yahoo user via API  -
     * - Use request.post() to call POST /api/auth/login - (Refer below API Doc link to construct )- https://api.eventhub.rahulshettyacademy.com/api/docs/#/Auth/post_auth_login)
     * - Pass { email, password } as the request body under the data key
     * - Assert the response is OK (loginRes.ok() is truthy)
     * - Parse the JSON response and extract token — you will use this for all subsequent API calls
     */

    const loginRes=await apiContext.post(`${API_URL}/auth/login`,{
        data: {
            email:userAcc2Payload.email,
            password : userAcc2Payload.password
        }
    })
     expect(loginRes.ok()).toBeTruthy();
    const loginJSON=await loginRes.json();
    const token=loginJSON.token;
    console.log("Yahoo user token : ",token);
    
  
    /**
     * Step 2 — Fetch events via API to get a valid event ID
     * - Use request.get() to call GET /api/events - (Refer below API Doc link to construct )- https://api.eventhub.rahulshettyacademy.com/api/docs/#/Events/get_events)
     * - Pass Authorization: Bearer <token> in the request headers
     * - Assert the response is OK
     * - Parse the JSON, read data[0].id — store this as eventId
     */

    const eventFetchRes=await apiContext.get(`${API_URL}/events`,{
        headers:{
            'Authorization':`Bearer ${token}`
        }
    });

    // await expect(eventFetchRes.status()).toBe(200);
     expect(eventFetchRes.ok()).toBeTruthy();
    const eventFetchJSon=await eventFetchRes.json();
    // console.log(eventFetchJSon);
    const eventId=eventFetchJSon.data[0].id;
    console.log(eventId);
    

    /**
     * Step 3 — Create a booking via API as Yahoo user
     * - Use request.post() to call POST /api/bookings  - (Refer below API Doc link to construct )-
     * https://api.eventhub.rahulshettyacademy.com/api/docs/#/Bookings/post_bookings
     * - Pass Authorization: Bearer <token> in headers
     * - Pass the booking payload in data:
     * - eventId — from Step 2
     * - customerName — any name e.g. 'Yahoo User'
     * - customerEmail — Yahoo user's email
     * - customerPhone — any 10-digit number
     * - quantity — 1
     * - Assert the response is OK
     * - Parse the JSON and extract data.id — store as yahooBookingId
     */

    const bookingRes=await apiContext.post(`${API_URL}/bookings`,{
        headers:{
            'Authorization': `Bearer ${token}`
        },
        data:{
            eventId: eventId,
            customerName : 'Yahoo User',
            customerEmail : userAcc2Payload.email,
            customerPhone : '8906311468',
            quantity :1
        }
    })

    expect(bookingRes.ok()).toBeTruthy();
    const bookingResJSon= await bookingRes.json();
    const yahooBookingId=bookingResJSon.data.id;
    console.log(yahooBookingId);

    await apiContext.dispose();


    /**
     * Step 4 — Login as Gmail user via browser UI
     * - Call your loginAs(page, GMAIL_USER) helper
     */

    await loginAs(page,userAcc1Payload);

    /**
     * Step 5 — Navigate to Yahoo's booking URL as Gmail user
     * - Navigate directly to /bookings/${yahooBookingId}
     * - Pass { waitUntil: 'networkidle' } as the navigation option so the page fully resolves before asserting
     */
    
    await page.goto(`https://eventhub.rahulshettyacademy.com/bookings/${yahooBookingId}`,{
        waitUntil:'networkidle'
    });

    /**
     * Step 6 — Validate Access Denied
     * - Assert text Access Denied is visible
     * - Assert text You are not authorized to view this booking is visible
     */
    const accessDenied= page.locator('text=Access Denied');
    await expect(accessDenied).toBeVisible();

    
    await expect(page.locator("text=You are not authorized to view this booking")).toBeVisible();
    
    // await page.pause();


    
})