import { expect, test } from "@playwright/test";
let webContext;

const email = "SB@gmail.com";
test.beforeAll(async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");

    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("saB#0808%TM");
    await page.locator("[type='submit']").click();
    // await page.waitForLoadState("networkidle");
    await page.locator(".card-body").last().waitFor();
    await context.storageState({ path: 'state.json' });//local, session storage data will be stored in state.json file
    webContext = await browser.newContext({ storageState: 'state.json' });

    //This apporach used when one time login will test all functionalities present in differnt test
    //every time no need to login, it will reduce the time
})

test('Capturing on titles of each cart', async () => {

    const page = await webContext.newPage();//new browser will open 

    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    //login is bypassed because we have stored the token into the local storage 
    // await page.pause();//here we can see token added in local storage
    await page.locator(".card-body").last().waitFor();

    // capturing all title of product
    const titles = await page.locator(".card-body h5").allTextContents();//if wait not added then it will return blank array
    console.log(titles);
});
test('E2E shopping Process-Add to cart and Checkout', async () => {

    const page = await webContext.newPage();//new browser will open 

    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    //login is bypassed because we have stored the token into the local sotarage     
    // await page.pause();//here we can see token added in local storage
    await page.locator(".card-body").last().waitFor();

    const products = page.locator(".card-body");
    // console.log("Total Count of product is : ", (await products.count()),"\n Items are :",await products.allTextContents());

    const count = await products.count();
    for (let i = 0; i < count; i++) {
        if (await products.nth(i).locator("b").textContent() === "ZARA COAT 3") {
            await products.nth(i).locator("text='Add To Cart'").click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();

    await page.locator("div li").first().waitFor();

    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();

    expect(bool).toBeTruthy();

    //Test for total price of order with sum of total in checkout
    const prodPrice = await page.locator(".prodTotal p").allTextContents();
    let sum = 0;
    for (let i = 0; i < (prodPrice.length); i++) {
        const price = prodPrice[i].replace('$', '').trim();
        sum += Number(price);
    }
    // console.log("Sum of price"+sum);

    const a = await page.locator(".totalRow .value").last().textContent();
    expect(Number(a.replace('$', ''))).toEqual(sum);

    await page.locator("text='Checkout'").click();


    //dynamic selection box
    await page.locator("[placeholder='Select Country']").pressSequentially("ind", { delay: 100 });
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();

    const countrynames = dropdown.locator(".ta-item");

    // console.log(await countrynames.nth(1).textContent());
    for (let i = 0; i < (await countrynames.count()); i++) {
        const cntName = (await countrynames.nth(i).textContent()).trim();
        if (cntName === "India") {
            console.log("country selected", await countrynames.nth(i).textContent());
            await countrynames.nth(i).click();
            break;
        }
    }

    const emailtext = page.locator(".user__name [type='text']").first();
    expect(emailtext).toHaveText(email);

    await page.locator(".action__submit").click();

    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

    const order_id = await page.locator(".em-spacer-1 .ng-star-inserted").first().textContent();
    console.log(order_id);

    //check the order into Orders tab
    await page.locator("[routerlink*='myorder']").first().click();

    await page.locator("tbody").waitFor();
   
    const rows = page.locator("tbody tr");

    for (let i = 0; i < await rows.count(); i++) {
        const roworderId = await rows.nth(i).locator("th").textContent();
        // console.log(i,"-->",roworderId);
        if (order_id.includes(roworderId)) {
            // console.log("Order id found")
            await rows.nth(i).locator(".btn-primary").click();
            break;
        }
    }

    const detailsOrderId = await page.locator(".col-text").textContent();
    expect(order_id.includes(detailsOrderId)).toBeTruthy();

    // await page.pause();

})