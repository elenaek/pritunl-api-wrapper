const axios = require('axios');
const createRandomString = require('crypto-random-string');
const crypto = require('crypto'); 

const {
    BASE_URL,
    API_TOKEN,
    API_SECRET
} = require("./config")

const getAuthHeaders = (credentials = {}) => {
    let defaultCredentials = require("./config");
    credentials = Object.assign({}, defaultCredentials, credentials)
    let authHeadersObj = {
        "Auth-Token": credentials.API_TOKEN,
        "Auth-Timestamp": Date.now(),
        "Auth-Nonce": createRandomString({length: 32}),
        "Auth-Signature": crypto.createHmac("sha256", credentials.API_SECRET).digest("base64")
    }
    return authHeadersObj;
}   

