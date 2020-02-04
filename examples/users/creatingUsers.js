const Pritunl = require('pritunl-api-wrapper');


/*
    Create a user named Coolkid
*/
(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    const user = priapi.User();

    let foundOrg = await organization.findOrganization("TooCool4SkewlOrg");
    let orgId = foundOrg.id;

    user.createUser(orgId, {name: "Coolkid"})
})()


/*
    Create multiple users with the pin 12345678 and enable client_to_client communcation only
*/
(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    const user = priapi.User();

    let foundOrg = await organization.findOrganization("TooCool4SkewlOrg");
    let orgId = foundOrg.id;

    let usersToCreateArr = ["BearCommander", "BearSoldier", "BearSniper", "LazyBear"];
    let usersToCreateParamsArr = await user.generateUserDefaultParams(usersToCreateArr, {pin: "12345678", client_to_client: true});
    user.createUsers(orgId, usersToCreateParamsArr);

})()
