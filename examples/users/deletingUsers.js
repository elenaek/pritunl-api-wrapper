const Pritunl = require('pritunl-api-wrapper');


/*
    Delete a user with the username CoolKid from the TooCool4SkewlOrg organization
*/
(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    const user = priapi.User();

    let foundOrg = await organization.findOrganizationByName("TooCool4SkewlOrg");
    let orgId = foundOrg.id;
    
    let usernameToFind = "CoolKid";
    let foundUser = await user.findUserByUsername(orgId, usernameToFind);

    user.deleteUser(orgId, foundUser);
})()

/*
    Delete all users with Cool in their names in the TooCool4SkewlOrg organization
*/
(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    const user = priapi.User();

    let foundOrg = await organization.findOrganizationByName("TooCool4SkewlOrg");
    let orgId = foundOrg.id;
    
    let userSearchPattern = /[\w\d\s]*Cool[\w\d\s]*/g
    let foundUsersArr = await user.findUsers(orgId, {
        name: userSearchPattern
    });

    user.deleteUsers(orgId, foundUsersArr);
})()