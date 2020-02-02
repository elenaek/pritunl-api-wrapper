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

    async findUser(orgId, username){
        var foundUser;
        try{
            let res = await super.authorizedRequest({
                method: "GET",
                path: `/user/${orgId}`
            });

            for (let user of res.data){
                if(user.name.toUpperCase() == username.toUpperCase()){
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
}

module.exports = User;