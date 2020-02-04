const fs = require('fs');
const path = require('path');
const Authentication = require('./Authentication');

class Key extends Authentication {
    constructor(props){
        super(props);
    }

    async downloadUsersClientConfigs(orgId, userArr, destDir){
        if(userArr.length){
            Promise.all(
                userArr.map(async (user) => {
                    try{
                        let res = await super.authorizedRequest({
                            method: "GET",
                            path: `/key/${orgId}/${user.id}.tar`
                        });
                        let fileData = JSON.parse(JSON.stringify(res.data));
                        let configDownloadFilePath = path.join(destDir, `${user.name}.ovpn`);
                        if(fs.existsSync(configDownloadFilePath)){
                            configDownloadFilePath = path.join(destDir, `${user.name}-${user.id}.ovpn`);
                        };
                        console.log(`Writing ${user.name}'s config to ${configDownloadFilePath}`);
                        fs.writeFile(configDownloadFilePath, fileData.slice(fileData.indexOf("#{"), fileData.indexOf("</key>")+7), () => {});
                    } catch(err){
                        console.log(err);
                    }
                })
            );
        }
        else{
            console.log("userArr argument is empty");
        }
    }

    async downloadUserClientConfig(orgId, userObj, destDir, fileName){
        if(Object.entries(userObj).length){
            try{
                let res = await super.authorizedRequest({
                    method: "GET",
                    path: `/key/${orgId}/${userObj.id}.tar`
                });
                let fileData = JSON.parse(JSON.stringify(res.data));
                let destFileName = fileName || `${userObj.name}.ovpn`;
                let configDownloadFilePath = path.join(destDir, destFileName);
                console.log(`Writing ${userObj.name}'s config to ${configDownloadFilePath}`);
                fs.writeFile(configDownloadFilePath, fileData.slice(fileData.indexOf("#{"), fileData.indexOf("</key>")+7), () => {});
            } catch(err){
                console.log(err);
            }
        }
        else{
            console.log("userObj argument is empty");
        }
    }
}

module.exports = Key;