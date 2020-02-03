const fs = require('fs');
const path = require('path');
const Authentication = require('./Authentication');

class Key extends Authentication {
    constructor(props){
        super(props);
    }

    async downloadAllOrganizationClientConfigs(orgId, userArr, destinationFolderPath){
        if(userArr){
            userArr.forEach(async (user) => {
                try{
                    let res = await super.authorizedRequest({
                        method: "GET",
                        path: `/key/${orgId}/${user.id}.tar`
                    });
                    let fileData = JSON.parse(JSON.stringify(res.data));
                    let configDownloadFilePath = path.join(destinationFolderPath, `${user.name}.ovpn`);
                    console.log(`Writing ${user.name}'s config to ${configDownloadFilePath}`);
                    fs.writeFile(configDownloadFilePath, fileData.slice(fileData.indexOf("#{"), fileData.indexOf("</key>")+7), () => {});
                } catch(err){
                    console.log(err);
                }
            });
        }
    }

    async downloadUserClientConfig(orgId, user, destinationFolderPath){
        if(user){
            try{
                let res = await super.authorizedRequest({
                    method: "GET",
                    path: `/key/${orgId}/${user.id}.tar`
                });
                let fileData = JSON.parse(JSON.stringify(res.data));
                let configDownloadFilePath = path.join(destinationFolderPath, `${user.name}.ovpn`);
                console.log(`Writing ${user.name}'s config to ${configDownloadFilePath}`);
                fs.writeFile(configDownloadFilePath, fileData.slice(fileData.indexOf("#{"), fileData.indexOf("</key>")+7), () => {});
            } catch(err){
                console.log(err);
            }
        }
    }
}

module.exports = Key;