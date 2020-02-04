const Pritunl = require('pritunl-api-wrapper');


/*
    Downloads all client configs for all users in the TooCool4SkewlOrg organization
*/
(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    const user = priapi.User();
    const key = priapi.Key();

    let foundOrg = await organization.findOrganization("TooCool4SkewlOrg");
    let orgId = foundOrg.id;
    let usersInOrgArr = await user.listUsers(orgId);
    let clientConfigDestinationPath = "./client_configs";
    key.downloadAllOrganizationClientConfigs(orgId, usersInOrgArr, clientConfigDestinationPath);
    // ==> Will download and log to console each file downloaded
})()

/*
    Downloads all client config for the user bearcommander in the TooCool4SkewlOrg organization.
    Name the Output file bearcommanderconfig.ovpn

    The default naming scheme is {username}.ovpn
*/
(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    const user = priapi.User();
    const key = priapi.Key();

    let foundOrg = await organization.findOrganization("TooCool4SkewlOrg");
    let orgId = foundOrg.id;

    let foundUser = await user.findUserByUsername(orgId, "bearcommander");
    let clientConfigDestinationPath = "./client_configs";
    key.downloadUserClientConfig(orgId, foundUser, clientConfigDestinationPath, "bearcommandconfig.ovpn");
    // ==> Will download and log to console
})()