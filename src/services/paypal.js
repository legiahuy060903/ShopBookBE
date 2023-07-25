const axios = require('axios');
const { CLIENT_ID, APP_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

async function capturePayment(orderId) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    };

    try {
        const response = await axios.post(url, {}, { headers });
        return handleResponse(response);
    } catch (error) {
        throw new Error(error.response.data || "An error occurred during payment capture.");
    }
}

async function generateAccessToken() {
    const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
    const url = `${base}/v1/oauth2/token`;
    const headers = {
        Authorization: `Basic ${auth}`,
    };
    const data = "grant_type=client_credentials";

    try {
        const response = await axios.post(url, data, { headers });
        return response.data.access_token;
    } catch (error) {
        throw new Error(error.response.data || "Failed to generate access token.");
    }
}

async function handleResponse(response) {
    if (response.status === 200 || response.status === 201) {
        return response.data;
    }
    throw new Error(response.data || "An error occurred in the API call.");
}

module.exports = { handleResponse, generateAccessToken, capturePayment };
