# Pritunl API Wrapper
* This API wrapper contains utility functions for working with the PritunlVPN API.


## Getting Started
1. `npm install --save pritunl-api-wrapper`
2. Set up your credentials using one of the following options:
     * Set the credentials during Pritunl object instantiation
     * Set environment variables
3. See examples in the `/examples` directory for basic usage

## Setting your credentials
### Using parameters on Pritunl object
* Set up your credentials during Pritunl object instantiation
    ```
        const Pritunl = require('pritunl-api-wrapper');
        
        (async() => {
            const pritunl = new Pritunl({
               baseUrl: "https://yourPritunl.com",
               apiToken: "yourApiToken",
               apiSecret: "yourApiSecret"
            });
        })();
    ```

### Using environment variables
* Set up your credentials using environment variables
    #### For Windows
    ```
    setx PRI_BASE_URL https://yourPritunl.com
    setx PRI_API_TOKEN yourApiToken
    setx PRI_API_SECRET yourApiSecret
    ```

    #### For MacOS or Linux
    * Exports will not persist unless you put them in your `~/.bash_profile`, `~/.bashrc` or `/etc/environment`
    * Please make sure you understand the differences between the files referenced above before setting your credentials there
    ```
    export PRI_BASE_URL="https://yourPritunl.com"
    export PRI_API_TOKEN="yourApiToken"
    export PRI_API_SECRET="yourApiSecret"
    ```

## Using Pritunl API Wrapper with a Self-Signed Certificate
* This module supports the use of self-signed certificates. Set your path to the CA cert during object instantiation on the `selfSignedCaPath` property
* If you are using a default installation without having manually generated any certs you can retrieve the cert found on the web GUI @ `Settings -> Advanced -> Server SSL Certificate` and paste it into a new file and give it the extension `.pem`

    ```
        const Pritunl = require('pritunl-api-wrapper');
        
        (async() => {
            const pritunl = new Pritunl({
               selfSignedCaPath: "./cacert/yourCaCert.pem"
            });
        })();
    ```


## Example Usage
* Below are a few example uses for this API wrapper.
* You'll find more examples in the `/examples` directory.


#### Listing all Organizations
```
const Pritunl = require('pritunl-api-wrapper');

(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
   
   const organizationArr = await organization.listOrganizations(); 
   console.log(organizationArr);
   // ==> Outputs an array of existing organization objects
})()
```

#### Finding a User in an Organization
* This returns the first occurrence of the user based on username. You can have multiple users with the same username in an organization so please make sure you either don't create multiple users with the same name or check to make sure you've got the right one with this function.
```
const Pritunl = require('pritunl-api-wrapper');

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
```

#### Download all client configurations in an Organization
* The naming format is `${username}.ovpn`
* All spaces are removed
```
const Pritunl = require('pritunl-api-wrapper');

(async() => {
    const priapi = new Pritunl();
    const organization = priapi.Organization();
    const user = priapi.User();
    const key = priapi.Key();
   
   let foundOrg = await organization.findOrganizationByName("TooCool4SkewlOrg");
   let orgId = foundOrg.id;
   let usersInOrgArr = await user.listUsers(orgId);
   let clientConfigDestinationPath = "./client_configs";
   key.downloadUsersClientConfigs(orgId, usersInOrgArr, clientConfigDestinationPath);
   // ==> Will download and log to console each file downloaded
})()
```