const Pritunl = require('pritunl-api-wrapper');

(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    
    const organizationArr = await organization.listOrganizations(); 
    console.log(organizationArr);
   // ==> Outputs an array of existing organization objects
})()
