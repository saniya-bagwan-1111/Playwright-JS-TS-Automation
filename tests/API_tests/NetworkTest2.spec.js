import { test, expect, request } from "@playwright/test";

test("View Order", async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.locator("#userEmail").fill("SB@gmail.com");
    await page.locator("#userPassword").fill("saB#0808%TM");
    await page.locator("[type='submit']").click();
 await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

     await page.locator("button[routerlink*='myorders']").click();
    //intercepting the network response call- means mocking the view order 
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        async route => {

            route.continue({//provided id which does not exist
                url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6a2159f417ee3e78babab501invalid"
            })
        }
    )

    // await page.pause();
    await page.locator("button:has-text('View')").first().click();
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
    
})