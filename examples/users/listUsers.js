const Pritunl = require('pritunl-api-wrapper');


/*
    List all users in the TooCool4SkewlOrg organization
    Note: This even lists users with the "server" type so please be careful if you are doing batch operations
    
    If you wish to get all users in an organization that are not of type "server" please look in the findingUsers.js file
*/
(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    const user = priapi.User();

    let foundOrg = await organization.findOrganizationByName("TooCool4SkewlOrg");
    let orgId = foundOrg.id;
    let usersInOrgArr = await user.listUsers(orgId);
    console.log(usersInOrgArr);
    // ==> Outputs all users found in TooCool4SkewlOrg
})()