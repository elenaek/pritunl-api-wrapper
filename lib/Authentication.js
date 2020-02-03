const https = require('https');
const fs = require('fs');
const crypto = require('crypto');

const axios = require('axios');
const axiosRetry = require('axios-retry');
const createRandomString = require('crypto-random-string');

axiosRetry(axios,{
    retries: 5,
    retryDelay: axiosRetry.exponentialDelay
});


class Authentication {
    constructor(props){
        let { baseUrl, apiToken, apiSecret, selfSignedCaPath } = props;
        if(!baseUrl || !apiToken || !apiSecret){
            let { PRI_BASE_URL, PRI_API_TOKEN, PRI_API_SECRET } = process.env; 
            if(PRI_BASE_URL && PRI_API_TOKEN && PRI_API_SECRET){
                this.props = {
                    ...props,
                    baseUrl: PRI_BASE_URL,
                    apiToken: PRI_API_TOKEN,
                    apiSecret: PRI_API_SECRET
                }
            }

            else{
                throw new Error("You must set valid values for baseUrl, apiToken, and apiSecret") 
            }
        }
        
        else{ this.props = props; }

        if(selfSignedCaPath && fs.existsSync(selfSignedCaPath)){ 
            axios.defaults.httpsAgent = new https.Agent({
                ca: [fs.readFileSync(selfSignedCaPath)],
                checkServerIdentity: () => {return null}, 
                keepAlive: false
            });
        };

        if(this.props.baseUrl[this.props.baseUrl.length-1] === "/"){
            this.props.baseUrl = this.props.baseUrl.slice(0, this.props.baseUrl.length-1);
        }
    }

    
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
            headers: authHeadersObj,
            data: options.data
        });
    }
}

module.exports = Authentication;
