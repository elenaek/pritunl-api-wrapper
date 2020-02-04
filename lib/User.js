const fs = require('fs');
const path = require('path');
const Authentication = require('./Authentication');

class User extends Authentication {
    constructor(props){
        super(props);
    }

    async listUsers(orgId){
        try{
            let res = await super.authorizedRequest({
                method: "GET",
                path: `/user/${orgId}`
            });
            return res.data;
        } catch(err){
            console.log(err);
        }
    }

    async findUser(orgId, params = {}){
        let foundUser;
        let searchKeyArr = Object.keys(params);

        if(searchKeyArr.length){
            try{
                let res = await super.authorizedRequest({
                    method: "GET",
                    path: `/user/${orgId}`
                });

                for(let user of res.data){
                    let matchCount = 0;
                    searchKeyArr.forEach((key) => {
                        if(user[key] === params[key]){
                            matchCount++;
                        }
                    });
                    if(matchCount == searchKeyArr.length){
                        foundUser = user;
                        break;
                    };
                }
            } catch(err){
                console.log(err);
            }
        }

        if(foundUser){ return foundUser }
        else{ console.log(`Couldn't find any matches`) }
    }

    async findUserByUsername(orgId, username){
        var foundUser;
        try{
            let res = await super.authorizedRequest({
                method: "GET",
                path: `/user/${orgId}`
            });

            for (let user of res.data){
                if(user.name.toUpperCase() == username.replace(" ","").toUpperCase()){
                    foundUser = user;
                    break;
                }
            }
        } catch(err){
            console.log(err);
        }
        if(foundUser){ return foundUser }
        else{ console.log(`Couldn't find ${username}`) }
    }


    async findUsers(orgId, params = {}){
        let foundUsersArr = [];
        let searchKeyArr = Object.keys(params);

        if(searchKeyArr.length){
            try{
                let res = await super.authorizedRequest({
                    method: "GET",
                    path: `/user/${orgId}`
                });

                res.data.forEach(async (user) => {
                    let matchCount = 0;
                    searchKeyArr.forEach(async (key) => {
                        if(user[key] == params[key]){
                                matchCount++;
                        }
                        else if(key == "name" && params[key] instanceof RegExp){
                            let matchPattern = params[key];
                            if(user[key].match(matchPattern)){
                                matchCount++;
                            }
                        }
                    });

                    if(matchCount == searchKeyArr.length){foundUsersArr.push(user)};
                });
            } catch(err){
                console.log(err);
            }
        }

        if(foundUsersArr.length){ return foundUsersArr }
        else{ console.log(`Couldn't find any matches`) }
    }

    async createUser(orgId, params = {}){
        let defaultParams = {
            name: "default-user",
            email: "",
            disabled: false,
            yubico_id: "",
            groups: [],
            pin: "",
            network_links: [],
            bypass_secondary: false,
            client_to_client: false,
            dns_servers: [],
            dns_suffix: "",
            port_forwarding: []
        };
        params = Object.assign({}, defaultParams, params);
        
        try{
            let res = await super.authorizedRequest({
                method: "POST",
                path: `/user/${orgId}`,
                data: params
            });
            
            if(res.data.length){ 
                let createdUser = res.data[0];                
                console.log(`User: ${createdUser.name.replace(" ","")} was created in the ${createdUser.organization_name} organization!`); 
            }
        } catch(err){
            console.log(err);
        }
    }

    async createUsers(orgId, userParamsArr){        
        try{
            let res = await super.authorizedRequest({
                method: "POST",
                path: `/user/${orgId}/multi`,
                data: userParamsArr
            });
            
            if(res.data){ 
                let createdUsers = res.data;            
                console.log(`${createdUsers.length} users have been created!`);
            }
        } catch(err){
            console.log(err);
        };
    }

    async updateUser(orgId, userObj, params){
        let userUpdateObject = Object.assign(userObj, params);
        try{
            let res = await super.authorizedRequest({
                method: "PUT",
                path: `/user/${orgId}/${userObj.id}`,
                data: userUpdateObject
            });
            
            if(res.data){ console.log(`User: ${userObj.name}(${userObj.id}) was updated!`) }
        } catch(err){
            console.log(err.response.data);
        }
    }
    
    async updateUsers(orgId, userObjArr, params){
        if(userObjArr.length){
            Promise.all(        
                userObjArr.map(async (userObj) => {
                    let userUpdateObject = Object.assign(userObj, params);
                    try{
                        let res = await super.authorizedRequest({
                            method: "PUT",
                            path: `/user/${orgId}/${userObj.id}`,
                            data: userUpdateObject
                        });
                        
                        if(res.data){ console.log(`User: ${userObj.name}(${userObj.id}) was updated!`) }
                    } catch(err){
                        console.log(err.response.data);
                    }
                })
            );
        }
    }

    async deleteUser(orgId, userObj){      
        try{
            let res = await super.authorizedRequest({
                method: "DELETE",
                path: `/user/${orgId}/${userObj.id}`
            });
            if(res.data){ console.log(`User: ${userObj.name}(${userObj.id}) was deleted from the ${userObj.organization_name} organization!`) }
        } catch(err){
            console.log(err);
        }
    }
    
    async deleteUsers(orgId, userObjArr){
        if(userObjArr.length){
            Promise.all(
                userObjArr.map( async (user) => {
                    try{
                        let res = await super.authorizedRequest({
                            method: "DELETE",
                            path: `/user/${orgId}/${user.id}`
                        });
                        if(res.data){ console.log(`User: ${user.name}(${user.id}) was deleted from the ${user.organization_name} organization!`) }
                    } catch(err){
                        console.log(err);
                    }
                })
            );
        }
    }

    async getUserAuditLog(orgId, userObj, destDir, filename){
        try{
            let res = await super.authorizedRequest({
                method: "GET",
                path: `/user/${orgId}/${userObj.id}/audit`
            });
            if(res.data){
                if(destDir && fs.existsSync(destDir)){
                    let destFileName = filename || `${userObj.name}-log.json`;
                    let destPath = path.join(destDir, destFileName);
                    await fs.writeFile(destPath, JSON.stringify(res.data), () => {});
                }
                else{ return res.data }
            }
        } catch(err){
            console.log(err);
        }        
    }

    async getUsersAuditLog(orgId, userObjArr, destDir){
        if(userObjArr.length){
            Promise.all(
                userObjArr.map(async (user) => {
                    try{
                        let res = await super.authorizedRequest({
                            method: "GET",
                            path: `/user/${orgId}/${user.id}/audit`
                        });
                        if(res.data){
                            if(destDir && fs.existsSync(destDir)){
                                let destFileName = `${user.name}-log.json`;
                                let destPath = path.join(destDir, destFileName);
                                await fs.writeFile(destPath, JSON.stringify(res.data), () => {});
                                console.log(`Log file for ${user.name} written to ${destPath}`);
                            }
                            else{ return res.data }
                        }
                    } catch(err){
                        console.log(err);
                    }    
                })
            );
        }
    }

    async generateUserDefaultParams(usernameArr, params){
        let defaultParams = {
            name: "default-user",
            email: "",
            disabled: false,
            yubico_id: "",
            groups: [],
            pin: "",
            network_links: [],
            bypass_secondary: false,
            client_to_client: false,
            dns_servers: [],
            dns_suffix: "",
            port_forwarding: []
        };
        params = Object.assign({}, defaultParams, params);
        
        let userDefaultParamsArr = usernameArr.map((username) => {
            return {
                ...params,
                name: username
            }
        });

        return userDefaultParamsArr;
    }

}

module.exports = User;