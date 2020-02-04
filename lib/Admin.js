const fs = require('fs');
const path = require('path');
const _hasIn = require('lodash/hasIn');

const createRandomString = require('crypto-random-string');
const Authentication = require('./Authentication');

class Admin extends Authentication {
    constructor(props){
        super(props);
    }

    async listAdmins(){
        try{
            let res = await super.authorizedRequest({
                method: "GET",
                path: "/admin"
            });
            return res.data;
        } catch(err){
            console.log(err);
        }        
    }

    async findAdmin(params = {}){
        let foundAdmin;
        let searchKeyArr = Object.keys(params);

        if(searchKeyArr.length){
            try{
                let res = await super.authorizedRequest({
                    method: "GET",
                    path: `/admin`
                });

                for(let admin of res.data){
                    let matchCount = 0;
                    searchKeyArr.forEach(async (key) => {
                        if(admin[key] == params[key]){
                                matchCount++;
                        }
                        else if(key == "username" && params[key] instanceof RegExp){
                            let matchPattern = params[key];
                            if(admin[key].match(matchPattern)){
                                matchCount++;
                            }
                        }
                    });

                    if(matchCount == searchKeyArr.length){
                        foundAdmin = admin;
                        break;
                    };
                }
            } catch(err){
                console.log(err);
            }
        }

        if(foundAdmin){ return foundAdmin }
        else{ console.log(`Couldn't find any matches`) }
    }

    async findAdminByUsername(username){
        var foundAdmin;
        if(username){
            try{
                let res = await super.authorizedRequest({
                    method: "GET",
                    path: `/admin`
                });
    
                if(res.data.length){
                    for (let user of res.data){
                        if(user.username.toUpperCase() == username.replace(" ","").toUpperCase()){
                            foundAdmin = user;
                            break;
                        }
                    }
                }
            } catch(err){
                console.log(err);
            }
            if(foundAdmin){ return foundAdmin }
            else{ console.log(`Couldn't find ${username}`) }
        }
    }

    async findAdmins(params = {}){
        let foundAdminsArr = [];
        let searchKeyArr = Object.keys(params);

        if(searchKeyArr.length){
            try{
                let res = await super.authorizedRequest({
                    method: "GET",
                    path: `/admin`
                });

                res.data.forEach(async (admin) => {
                    let matchCount = 0;
                    searchKeyArr.forEach(async (key) => {
                        if(admin[key] == params[key]){
                                matchCount++;
                        }
                        else if(key == "username" && params[key] instanceof RegExp){
                            let matchPattern = params[key];
                            if(admin[key].match(matchPattern)){
                                matchCount++;
                            }
                        }
                    });

                    if(matchCount == searchKeyArr.length){foundAdminsArr.push(admin)};
                });
            } catch(err){
                console.log(err);
            }
        }

        if(foundAdminsArr.length){ return foundAdminsArr }
        else{ console.log(`Couldn't find any matches`) }
    }

    async createAdmin(params = {}){
        let defaultParams = {
            username: "default-admin",
            password: createRandomString({length: 15}),
            super_user: false,
            audit: true,
            disabled: false,
            auth_api: false,
            token: "",
            secret: "",
            otp_auth: false,
            otp_secret: false
        };
        params = Object.assign({}, defaultParams, params);
        
        try{
            let res = await super.authorizedRequest({
                method: "POST",
                path: `/admin`,
                data: params
            });

            if(res.data){ 
                let createdAdmin = res.data;                
                console.log(`Admin: ${createdAdmin.username.replace(" ","")} was created!`); 
            }
        } catch(err){
            console.log(`${params.username}: ` + JSON.stringify(err.response.data));
        }
    }

    async createAdmins(adminParamsArr){
        if(adminParamsArr.length){
            return await Promise.all(
                adminParamsArr.map(async (adminParamObj) => {
                    try{
                        let res = await super.authorizedRequest({
                            method: "POST",
                            path: `/admin`,
                            data: adminParamObj
                        });
                        if(res.data){ 
                            let createdAdmin = res.data;                
                            console.log(`Admin: ${createdAdmin.username.replace(" ","")} was created!`); 
                        }
                    } catch(err){
                        console.log(`${adminParamObj.username}: ` + JSON.stringify(err.response.data));
                    }
                })
            );
        }
    }

    async updateAdmin(adminObj, updateParams){
        if(updateParams && Object.entries(updateParams).length){
            let adminUpdateObject = Object.assign(adminObj, updateParams);
            if(!updateParams.token){ adminUpdateObject.token = "" };
            if(!updateParams.secret){ adminUpdateObject.secret = "" };
            try{
                let res = await super.authorizedRequest({
                    method: "PUT",
                    path: `/admin/${adminObj.id}`,
                    data: adminUpdateObject
                });
                
                if(res.data){ console.log(`Admin: ${adminObj.username}(${adminObj.id}) was updated!`) }
            } catch(err){
                console.log(`${adminObj.username}: ${JSON.stringify(err.response.data)}`);
            }
        }
    }

    async updateAdmins(adminObjArr, updateParams){
        if(adminObjArr.length && updateParams && Object.entries(updateParams).length){
            return await Promise.all(
                adminObjArr.map(async (adminObj) => {
                    let adminUpdateObject = Object.assign(adminObj, updateParams);
                    if(!updateParams.token){ adminUpdateObject.token = "" };
                    if(!updateParams.secret){ adminUpdateObject.secret = "" };
                    try{
                        let res = await super.authorizedRequest({
                            method: "PUT",
                            path: `/admin/${adminObj.id}`,
                            data: adminUpdateObject
                        });
                        
                        if(res.data){ console.log(`Admin: ${adminObj.username}(${adminObj.id}) was updated!`) }
                    } catch(err){
                        console.log(`${adminObj.username}: ${JSON.stringify(err.response.data)}`);
                    }
                })
            );
        }
    }

    async deleteAdmin(adminObj){
        if(adminObj && Object.entries(adminObj).length){
            try{
                let res = await super.authorizedRequest({
                    method: "DELETE",
                    path: `/admin/${adminObj.id}`
                });
                if(res.data){ console.log(`Admin: ${adminObj.username}(${adminObj.id}) was deleted!`) }
            } catch(err){
                console.log(`${adminObj.username}: ${JSON.stringify(err.response.data)}`);
            }
        }
    }

    async deleteAdmins(adminObjArr){
        if(adminObjArr.length){
            return await Promise.all(
                adminObjArr.map( async (adminObj) => {
                    try{
                        let res = await super.authorizedRequest({
                            method: "DELETE",
                            path: `/admin/${adminObj.id}`
                        });
                        if(res.data){ console.log(`Admin: ${adminObj.username}(${adminObj.id}) was deleted!`) }
                    } catch(err){
                        console.log(`${adminObj.username}: ${JSON.stringify(err.response.data)}`);
                    }
                })
            );
        }
    }

    async getAdminAuditLog(adminObj, destDir, filename){
        if(adminObj && Object.entries(adminObj).length){
            try{
                let res = await super.authorizedRequest({
                    method: "GET",
                    path: `/admin/${adminObj.id}/audit`
                });
                if(res.data){
                    if(destDir && fs.existsSync(destDir)){
                        let destFileName = filename || `${adminObj.username}-admin-log.json`;
                        let destPath = path.join(destDir, destFileName);
                        if(fs.existsSync(destPath)){
                            destPath = path.join(destDir, `${adminObj.username}-${adminObj.id}-admin-log.json`);
                        };
                        await fs.writeFile(destPath, JSON.stringify(res.data), () => {});
                        console.log(`Audit log file for ${adminObj.username} written to ${destPath}`);
                    }
                    return res.data;
                }
            } catch(err){
                console.log(`${adminObj.username}: ${_hasIn(err, "response.data")? JSON.stringify(err.response.data) : err}`);
            }
        }
    }
    
    async getAdminsAuditLogs(adminObjArr, destDir){
        if(adminObjArr.length){
            return await Promise.all(
                adminObjArr.map(async (adminObj) => {
                    if(adminObj && Object.entries(adminObj).length){
                        try{
                            let res = await super.authorizedRequest({
                                method: "GET",
                                path: `/admin/${adminObj.id}/audit`
                            });
                            if(res.data){
                                if(destDir && fs.existsSync(destDir)){
                                    let destFileName = `${adminObj.username}-admin-log.json`;
                                    let destPath = path.join(destDir, destFileName);
                                    if(fs.existsSync(destPath)){
                                        destPath = path.join(destDir, `${adminObj.username}-${adminObj.id}-admin-log.json`);
                                    };
                                    await fs.writeFile(destPath, JSON.stringify(res.data), () => {});
                                    console.log(`Audit log file for ${adminObj.username} written to ${destPath}`);
                                }
                                return res.data;
                            }
                        } catch(err){
                            console.log(`${adminObj.username}: ${_hasIn(err, "response.data")? JSON.stringify(err.response.data) : err}`);
                        }
                    }
                })
            );
        }
    }

    async generateAdminDefaultParams(adminUsernameArr, params){
        let defaultParams = {
            username: "default-admin",
            password: "",
            super_user: false,
            disabled: false,
            auth_api: false,
            token: "",
            secret: "",
            otp_auth: false,
            otp_secret: false,
            audit: true
        };
        params = Object.assign({}, defaultParams, params);
        
        let adminDefaultParamsArr = adminUsernameArr.map((username) => {
            return {
                ...params,
                username: username,
                password: createRandomString({length: 15})
            }
        });

        return adminDefaultParamsArr;
    }
}

module.exports = Admin;