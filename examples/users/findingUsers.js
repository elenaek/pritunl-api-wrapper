const Pritunl = require('pritunl-api-wrapper');


/*
    Find a user named CoolKid
*/
(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    const user = priapi.User();

    let foundOrg = await organization.findOrganizationByName("TooCool4SkewlOrg");
    let orgId = foundOrg.id;
    let usernameToFind = "CoolKid";
    let foundUser = await user.findUserByUsername(orgId, usernameToFind);
    console.log(foundUser);
    // ==> Outputs the user object for the first occurrence of the found user
})()


/*
    Find a user named CoolKid with the email address cool.kid@gmail.com
*/
(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    const user = priapi.User();

    let foundOrg = await organization.findOrganizationByName("TooCool4SkewlOrg");
    let orgId = foundOrg.id;

    let userToFindParams = {
        name: "CoolKid",
        email: "cool.kid@gmail.com"
    };

    let foundUser = await user.findUser(orgId, userToFindParams);
    console.log(foundUser);
    // ==> Outputs the user object for the first occurrence of the found user
})()


/*
    Find all users with the name CoolKid and client_to_client enabled
*/
(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    const user = priapi.User();

    let foundOrg = await organization.findOrganizationByName("TooCool4SkewlOrg");
    let orgId = foundOrg.id;

    let userSearchParams = {
        name: "CoolKid",
        client_to_client: true
    };

    let foundUsersArr = await user.findUsers(orgId, userSearchParams);
    console.log(foundUsersArr);
    // ==> Outputs the array of user objects which match the search params
})()


/*
    Find users with any permutation of the word Bear in their username
    You can set a regex value in the name param to do a regex match for searching users
*/
(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    const user = priapi.User();

    let foundOrg = await organization.findOrganizationByName("TooCool4SkewlOrg");
    let orgId = foundOrg.id;

    let nameSearchRegex = /Bear/gi;
    let userSearchParams = {
        name: nameSearchRegex
    };
    let foundUsersArr = await user.findUsers(orgId, userSearchParams);
    console.log(foundUsersArr);
})()

const Pritunl = require('pritunl-api-wrapper');


/*
    Find all users of type "client" in the TooCool4SkewlOrg organization
*/
(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    const user = priapi.User();

    let foundOrg = await organization.findOrganizationByName("TooCool4SkewlOrg");
    let orgId = foundOrg.id;
    let allClientTypeUsersArr = await user.findUsers(orgId, {type: "client"});
    console.log(allClientTypeUsersArr);
})()