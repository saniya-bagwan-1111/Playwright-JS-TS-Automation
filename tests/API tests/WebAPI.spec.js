import {test,  expect, request } from "@playwright/test";

const {APiUtils}= require('./utils/APiUtils');

const loginPayload= { userEmail: "SB@gmail.com", userPassword: "saB#0808%TM"};
const orderPayload={orders: [{country: "India", productOrderedId: "6960ea76c941646b7a8b3dd5"}]};

let response;

test.beforeAll(async()=>{
    //execute only once before all test cases
    const apiContext=await request.newContext();
    
    const  apiutils=new APiUtils(apiContext,loginPayload);
    response= await apiutils.createOrder(orderPayload);
})
//

test.beforeEach(()=>{
    //execute before each test case
})

test("Place the order",async({page})=>{

    page.addInitScript(value=>{
        window.localStorage.setItem('token',value)
    },response.token);//token passsed as value to value function present inside addInitScript

    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
   
    //After using token in local storage no need to pass values into login page, it will bypass log in functionality, directly goes to cart
    //Order placed dipslayed into the orders

    await page.locator("[routerlink*='myorder']").first().click();
    await page.locator("tbody").waitFor();
    
    const rows =  page.locator("tbody tr");

    for(let i=0; i< await rows.count();i++)
    {
        const roworderId=await rows.nth(i).locator("th").textContent();
        // console.log(i,"-->",roworderId);
        if(response.orderId.includes(roworderId))
        {
            // console.log("Order id found")
            await rows.nth(i).locator(".btn-primary").click();
            break;
        }
    }

    await page.pause();
    const detailsOrderId=await page.locator(".col-text").textContent();
    expect(response.orderId.includes(detailsOrderId)).toBeTruthy();

})