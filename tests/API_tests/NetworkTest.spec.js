import {test,  expect, request } from "@playwright/test";

const {APiUtils}= require('./utils/APiUtils');

const loginPayload= { userEmail: "SB@gmail.com", userPassword: "saB#0808%TM"};
const orderPayload={orders: [{country: "India", productOrderedId: "6960ea76c941646b7a8b3dd5"}]};
const fakeResponse= {data:[],message:"No Orders."};
let response;

test.beforeAll(async()=>{
    //execute only once before all test cases
    const apiContext=await request.newContext();
    
    const  apiutils=new APiUtils(apiContext,loginPayload);
    response= await apiutils.createOrder(orderPayload);
})
//

test("Mock the orders page",async({page})=>{

    page.addInitScript(value=>{
        window.localStorage.setItem('token',value)
    },response.token);//token passsed as value to value function present inside addInitScript

    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    
    //intercepting the network response call- means mocking the orders 
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route=>{
            //intercepting response-->
            //  API given the response->
            const response= await page.request.fetch(route.request());
            // Fake response - playwright will add 
            let body=JSON.stringify(fakeResponse);
            route.fulfill({
                response,//here overiding the response with body means fake response
                body
            })
            // browser will fetch response-> render that response to front end
        }
    )

    // await page.pause();
    await page.locator("[routerlink*='myorder']").first().click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    
    console.log(await page.locator(".mt-4").textContent());//this text takes time to display

})