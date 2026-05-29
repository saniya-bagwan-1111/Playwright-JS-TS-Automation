const {test, chromium, expect} = require('@playwright/test');

test('basic Test',async()=>{

    const browser=await chromium.launch();//context
    const page=await browser.newPage();
    await page.goto("http://google.com");
    const title= await page.title();
    expect(title).toBe("Google");
});

test('Test with out conetxt',async({page})=>{

    await page.goto("https://www.flipkart.com/");
    console.log(await page.title());
    await expect(page).toHaveTitle(/Online/);//uing regular ecpressiion cheking title contains word Online
})


test('Test Login Page',async({page})=>{

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    
    // location username and password elements using their id 
    await page.locator("#username").type("Saniya");//type method is now drepraciated
    // await page.locator("input#password").fill("Saniya");//using id location password
    await page.locator("[type=password]").fill("Saniya");//using attribute 
    await page.locator("input.btn.btn-info.btn-md").click();//used calss name

    //when entriing wrong username and password it display message 
    console.log("user login message:" ,await page.locator("[style*='block']").textContent());
    //assertion
    await expect(page.locator("[style*='block']")).toContainText("Incorrect");
})