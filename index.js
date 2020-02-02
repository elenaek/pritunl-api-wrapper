const https = require('https');
const fs = require('fs');
const util = require('util');

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

const users = async (options = {}) => {
    let defaultOptions = {
        action: ACTIONS.LIST,
        credentials: DEFAULT_CONFIG,
        baseUrl: DEFAULT_CONFIG.BASE_URL,
        orgId: 1
    };
    options = Object.assign({}, defaultOptions, options);

    switch(options.action){
        case ACTIONS.LIST:
            let method = "GET";
            let path = `/user/${options.orgId}`;
            let authHeaders = getAuthHeaders({
                method,
                path,
                credentials: options.credentials
            });
            return axios({
                method: "get",
                url: `${options.baseUrl}${path}`,
                headers: authHeaders
            });
    }
}


const organizations = async (options = {}) => {
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
                url: `${options.baseUrl}${path}`,
                headers: authHeaders 
            });
    }
}

const key = async (options = {}) => {
    let defaultOptions = {
        action: ACTIONS.GET,
        orgId: 1,
        userId: 1,
        credentials: DEFAULT_CONFIG,
        baseUrl: DEFAULT_CONFIG.BASE_URL
    };
    options = Object.assign({}, defaultOptions, options);

    switch(options.action){
        case ACTIONS.GET:
            let method = "GET";
            let path = `/key/${options.orgId}/${options.userId}.tar`;
            let authHeaders = getAuthHeaders({
                method,
                path,
                credentials: options.credentials
            });
            return axios({
                method,
                url: `${options.baseUrl}${path}`,
                headers: authHeaders
            })
    }
}


(async() => {
    let organizationId = (await organizations({action: ACTIONS.LIST})).data[0].id;
    let usersArr = (await users({action: ACTIONS.LIST, orgId: organizationId})).data;
    usersArr.forEach(async (user) => {
        let res = (await key({action: ACTIONS.GET, orgId: organizationId, userId: user.id}));
        let fileData = JSON.parse(JSON.stringify(res.data));
        let configDownloadFilePath = `${DEFAULT_CONFIG.CLIENT_CONFIG_PATH}/${user.name}.ovpn`
        console.log(`Writing ${user.name}'s config to ${configDownloadFilePath}`);
        await fs.writeFile(configDownloadFilePath, fileData.slice(fileData.indexOf("#{"), fileData.indexOf("</key>")+7), () => {});
    });
})();