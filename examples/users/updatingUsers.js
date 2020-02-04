const Pritunl = require('pritunl-api-wrapper');


/*
    Update a user named CoolKid to have the username BearCommander and set the user's pin to 12345678
*/
(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    const user = priapi.User();

    let foundOrg = await organization.findOrganization("TooCool4SkewlOrg");
    let orgId = foundOrg.id;
    let usernameToFind = "CoolKid";
    
    let foundUser = await user.findUserByUsername(orgId, usernameToFind);
    user.updateUser(orgId, foundUser, {name: "BearCommander", pin: "12345678"});

})()


/*
    Update all users who do not have pins to have the pin 12345678
*/
(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    const user = priapi.User();

    let foundOrg = await organization.findOrganization("TooCool4SkewlOrg");
    let orgId = foundOrg.id;
    
    let usersWithoutPins = await user.findUsers(orgId, {pin: false, type: "client"});
    user.updateUsers(orgId, usersWithoutPins, {pin: "12345678"})
})()
