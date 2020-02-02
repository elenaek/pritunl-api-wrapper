const https = require('https');
const fs = require('fs');

const axios = require('axios');
const createRandomString = require('crypto-random-string');
const crypto = require('crypto');


const { ACTIONS } = require("./constants");

const DEFAULT_CONFIG = require("./config")


let SELF_SIGNED_CA = "";

try {
    SELF_SIGNED_CA = fs.readFileSync(DEFAULT_CONFIG.CA_PATH);
} catch(err){
    console.log(`There is no CA certificate available at ${DEFAULT_CONFIG.CA_PATH}`);
}

axios.defaults.httpsAgent = new https.Agent({
    ca: [SELF_SIGNED_CA],
    checkServerIdentity: () => {return null}, 
    keepAlive: false
});


const getAuthHeaders = (options = {}) => {
    let defaultOptions = {
        credentials: DEFAULT_CONFIG,
        method: "GET",
        path: "/organization"
    };
    options = Object.assign({}, defaultOptions, options);

    let authNonce = createRandomString({length: 32});
    let authTimeStamp = Math.floor(Date.now() / 1000);
    let authString = [options.credentials.API_TOKEN, authTimeStamp, authNonce, options.method.toUpperCase(), options.path].join("&");
    let authHeadersObj = {
        "Auth-Token": options.credentials.API_TOKEN,
        "Auth-Timestamp": authTimeStamp,
        "Auth-Nonce": authNonce,
        "Auth-Signature": crypto.createHmac("sha256", options.credentials.API_SECRET).update(authString).digest("base64")
    }

    return authHeadersObj;
}   

const getUsers = (options = {}) => {
    let defaultOptions = {
        action: ACTIONS.LIST,
        credentials: DEFAULT_CONFIG,
        baseUrl: DEFAULT_CONFIG.BASE_URL
    };
    options = Object.assign({}, defaultOptions, options);

    switch(options.action){
        case ACTIONS.LIST:
            return axios({
                method: "get",
                url: `${options.baseUrl}/user/${options.orgId}`,
                headers: options.credentials
            });
    }
}


const getOrganization = async (options = {}) => {
    let defaultOptions = {
        action: ACTIONS.LIST,
        credentials: DEFAULT_CONFIG,
        baseUrl: DEFAULT_CONFIG.BASE_URL
    };
    options = Object.assign({}, defaultOptions, options);

    switch(options.action){
        case ACTIONS.LIST:
            let method = "GET";
            let path = "/organization";
            let authHeaders = getAuthHeaders({
                method,
                path,
                credentials: options.credentials
            });
            return axios({
                method,
                url: `${options.baseUrl}/organization`,
                headers: authHeaders 
            });
    }
}


(async() => {
    let organizationId = (await getOrganization()).data[0].id;
    console.log(organizationId);
})();