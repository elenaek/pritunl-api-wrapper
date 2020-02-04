
const fs = require('fs');
const path = require('path');
const Authentication = require('./Authentication');

class Log extends Authentication {
    constructor(props){
        super(props);
    }

    async getDashboardLogs(destDir, filename){
        try{
            let res = await super.authorizedRequest({
                method: "GET",
                path: `/log`
            });
            
            if(res.data){
                if(destDir && fs.existsSync(destDir)){
                    let destFileName = filename || `dashboard-log.json`;
                    let destPath = path.join(destDir, destFileName);
                    await fs.writeFile(destPath, JSON.stringify(res.data), () => {});
                    console.log(`Dashboard log file written to ${destPath}`);
                }
                else{ return res.data }
            }
        } catch(err){
            console.log(err);
        }
    }

    async getSystemLogs(destDir, filename){
        try{
            let res = await super.authorizedRequest({
                method: "GET",
                path: `/logs`
            });
            if(res.data.output){
                if(destDir && fs.existsSync(destDir)){
                    let destFileName = filename || `dashboard-log.json`;
                    let destPath = path.join(destDir, destFileName);
                    await fs.writeFile(destPath, res.data.output.join("\n"), () => {});
                    console.log(`System log file written to ${destPath}`);
                }
                else{ return res.data.output }
            }
        } catch(err){
            console.log(err);
        }
    }
}

module.exports = Log;