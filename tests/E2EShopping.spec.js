import {expect, test} from "@playwright/test";

test.only('E2E shopping Process',async({page})=>{

    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.locator("#userEmail").fill("SB@gmail.com");
    await page.locator("#userPassword").fill("saB#0808%TM");
    await page.locator("[type='submit']").click();

    //all items are not loaded so have to add the wait
    // await page.waitForLoadState("networkidle");//this will wait until all networks are loaded

    //another way- until loactor gets loaded wait for that locator, when mutiple elements found that time mostly it is used last used because till last eement gets loaded successful wit to execuste next step
    await page.locator(".card-body").last().waitFor();

    // capturing all title of product
    const titles=await page.locator(".card-body h5").allTextContents();//if wait not added then it will return blank array
    // console.log(titles);

    const products=page.locator(".card-body");
    // console.log("Total Count of product is : ", (await products.count()),"\n Items are :",await products.allTextContents());

    const count=await products.count();
    for(let i=0;i<count;i++)
    {
        if(await products.nth(i).locator("b").textContent() === "ZARA COAT 3")
        {
            await products.nth(i).locator("text='Add To Cart'").click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();

    await page.locator("div li").first().waitFor();

    const bool=await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    
    expect(bool).toBeTruthy();

    //Test for total price of order with sum of total in checkout
    const prodPrice=await page.locator(".prodTotal p").allTextContents();
    let sum=0;
    for(let i=0;i<( prodPrice.length);i++)
    {
        const price=prodPrice[i].replace('$','').trim();
        sum+=Number(price);
    }
    // console.log("Sum of price"+sum);

    const a=await page.locator(".totalRow .value").last().textContent();
    expect(Number(a.replace('$',''))).toEqual(sum);
    
    await page.locator("text='Checkout'").click();
    
    
    //dynamic selection box
    await page.locator("[placeholder='Select Country']").pressSequentially("ind",{delay:100});
    const  dropdown= page.locator(".ta-results");
    await dropdown.waitFor();
    
    const countrynames= dropdown.locator(".ta-item");

    // console.log(await countrynames.nth(1).textContent());
    for(let i=0;i<(await countrynames.count());i++)
    {
        const cntName=(await countrynames.nth(i).textContent()).trim();
        if( cntName=== "India")
        {
            console.log("country selected",await countrynames.nth(i).textContent());
            await countrynames.nth(i).click();
            break;
        }
    }
    // await page.pause();

})