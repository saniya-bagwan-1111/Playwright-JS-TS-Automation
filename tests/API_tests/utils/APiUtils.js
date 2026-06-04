class APiUtils {

    constructor(apiContext,loginPayload) {

        this.apiContext = apiContext;
        this.loginPayload=loginPayload;
    }

    async getToken() {
        const loginresponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
            { data: this.loginPayload });

        const logginResponseJson = await loginresponse.json();
        // console.log(logginResponseJson;
        const token = logginResponseJson.token;
        console.log(token);
        return token;
    }

    async createOrder(orderPayload) {
        let response ={};
        response.token=await this.getToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                data: orderPayload,
                headers: {
                    'Authorization': response.token,
                    'Content-Type': 'application/json'
                }

            });

        const orderResponseJson = await orderResponse.json();
        console.log(orderResponseJson.message);

        response.orderId = orderResponseJson.orders[0];
        console.log("Placed order Id-", response.orderId);

        return response;

    }
}

module.exports={APiUtils};