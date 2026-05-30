import {expect, test} from "@playwright/test";

test.only('E2E shopping Process',async({page})=>{

    const email="SB@gmail.com";

    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");

    await page.getByPlaceholder("email@example.com").fill(email);

    await page.getByPlaceholder("enter your passsword").fill("saB#0808%TM");

    await page.getByRole("button",{type:"Submit"}).click();

    await page.locator(".card-body").last().waitFor();
  
    await page.locator(".card-body").filter({hasText:"ZARA COAT 3"})
    .getByRole("button",{name:" Add To Cart"}).click();

    await page.getByRole("listitem").getByRole("button",{name:"Cart"}).click();

    await page.locator("div li").first().waitFor();

    expect(await page.getByText('ZARA COAT 3').isVisible()).toBeTruthy();

    await page.getByRole("button",{name:'checkout'}).click();
    
    //dynamic selection box
    await page.getByPlaceholder("Select Country").pressSequentially('ind');
    
    await page.getByRole("button",{name:'India'}).nth(1).click();

    const emailtext=page.locator(".user__name [type='text']").first();
    expect(emailtext).toHaveText(email);

    await page.getByText("Place Order").click();
    
    await page.getByText("Thankyou for the order.").isVisible();
  // await page.pause();
  
})