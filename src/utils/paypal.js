const paypal = require('paypal-rest-sdk');
const CLIENT_ID = 'AXIMRpiCoDIuot6gxIfny6IhOK455wTKnhBwPirr8smadBUcvu4qPKLjvSeUqDdfYwj1Bcm1KqiEpxd2';
const APP_SECRET = 'EI71fLdyghGdCycYONI5W9Vu0k-NtWYV5U2jYghX2jsdJbOk2E_NjYJABhA53z33kczlb5EkJm8T1bjB';
paypal.configure({
    'mode': 'sandbox',
    'client_id': CLIENT_ID,
    'client_secret': APP_SECRET
});
const baseURL = {
    sandbox: "https://api-m.sandbox.paypal.com",
    production: "https://api-m.paypal.com"
};

async function generateAccessToken() {
    const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "post",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });

    const jsonData = await handleResponse(response);
    return jsonData.access_token;
}

module.exports = { baseURL, paypal, generateAccessToken };