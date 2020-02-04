
const Authentication = require('./Authentication');

class Log extends Authentication {
    constructor(props){
        super(props);
    }

    async getDashboardLogs(){
        try{
            let res = await super.authorizedRequest({
                method: "GET",
                path: `/log`
            });
            return res.data;
        } catch(err){
            console.log(err);
        }
    }

    async getSystemLogs(){
        try{
            let res = await super.authorizedRequest({
                method: "GET",
                path: `/logs`
            });
            return res.data.output;
        } catch(err){
            console.log(err);
        }
    }
}

module.exports = Log;