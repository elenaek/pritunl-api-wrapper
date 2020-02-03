const {
    Authentication,
    Organization,
    User,
    Key
} = require('./lib');


/*
    Constructor:
        Required:
            baseUrl: Base URL to use for Axios requests. No trailing forward slash.
                e.g. "https://yourPritunl.domain.com" 
            apiToken: Your API token for Axios requests.
            apiSecret: Your API secret for Axios requests.
        Optional:
            selfSignedCaPath: If you are using a self signed cert, set the self signed ca cert here to allow Axios to use it.
                Self signed cert can be gotten from Pritunl Web GUI 
                    -> Settings 
                    -> Advanced 
                    -> Server SSL Certificate 
                    -> Copy the contents to a file and give it the .pem extension
*/
module.exports = class Pritunl extends Authentication{
    constructor(props){
        super(props);
    }

    Organization(){
        return new Organization(this.props);
    }

    User(){
        return new User(this.props);
    }

    Key(){
        return new Key(this.props);
    }
}