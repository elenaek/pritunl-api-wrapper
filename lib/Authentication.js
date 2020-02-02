const https = require('https');
const fs = require('fs');

const axios = require('axios');
const createRandomString = require('crypto-random-string');
const crypto = require('crypto');


module.exports = class Authentication {
    constructor(props){
        let { baseUrl, apiToken, apiSecret, selfSignedCaPath } = props;
        if(!baseUrl || !apiToken || !apiSecret){ throw new Error("You must set valid values for baseUrl, apiToken, and apiSecret") };
        if(selfSignedCaPath && fs.existsSync(selfSignedCaPath)){ 
            axios.defaults.httpsAgent = new https.Agent({
                ca: [fs.readFileSync(selfSignedCaPath)],
                checkServerIdentity: () => {return null}, 
                keepAlive: false
            });
        };

        this.props = props;
    }

    /*
        Function that generates an auth header object for Axios requests
        Requires:
            credentials: Object containing apiToken and apiSecret
            method: String request method ("GET", "POST" etc)
            path: String containing the request path to append to baseUrl. Used for creating hmac digest so please use the following format
                e.g.
                    "/organization"
    */
    async authorizedRequest(options = {}){
        let { apiToken, apiSecret, baseUrl } = this.props;
        let defaultOptions = {
            apiToken,
            apiSecret,
            baseUrl,
            method: "GET",
            path: "/organization"
        };
        options = Object.assign({}, defaultOptions, options);
    
        let authNonce = createRandomString({length: 32});
        let authTimeStamp = Math.floor(Date.now() / 1000);
        let authString = [options.apiToken, authTimeStamp, authNonce, options.method.toUpperCase(), options.path].join("&");
        let authHeadersObj = {
            "Auth-Token": options.apiToken,
            "Auth-Timestamp": authTimeStamp,
            "Auth-Nonce": authNonce,
            "Auth-Signature": crypto.createHmac("sha256", options.apiSecret).update(authString).digest("base64")
        }
        
        let url = `${baseUrl}${options.path}`;
        return axios({
            method: options.method,
            url,
            headers: authHeadersObj
        });
    }
}
