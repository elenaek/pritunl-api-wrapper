# API Overview
* This wrapper is mapped based on the route handlers in the Pritunl API
### Authentication
* All other classes inherit from this class
* Contains a function to generate the proper auth headers and send requests to the API
### Organization
* Contains functions dealing with Organizations
* e.g. List all organizations, find an organization by name, etc.
### User
* Contains functions dealing with Users
* e.g. List all users, find users by params, find users by username, create/delete/update, user audit logs etc.
### Admin
* Contains functions for dealing with Admins
* e.g. List all admins, find admins by params, find admins by username, create/delete/update, admin audit logs etc.
### Key
* Contains functions to download all users or a single user's ovpn client config
### Log
* Contains functions for retrieving logs
* e.g. retrieve system logs or dashboard logs