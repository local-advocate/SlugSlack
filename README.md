# SlugSlack
A single page, context shared application version of the original Slack app.  
* This application contains the following original features: Workspaces, Channels, and Messaging.
* Users are able to create and delete workspaces. Furthermore, owners can invite other users to and revoke a user’s access from their workspace.  
* Inside a workspace, owners of the workspace have the ability to create and delete default (public) and non-default (private) channels. Additionally, owners can add and remove a user from a specific channel in their workspace.  
* Inside a channel, all the users who have access to that channel are able to view and create messages.  
* Technology stack: TypeGraphQL, NextJS, React, PostgreSQL.  


## Demonstration
YouTube Link: https://youtu.be/WiOv021PWm8  
[![SlugSlack Demonstration](https://github.com/local-advocate/SlugSlack/blob/main/SlugSlack.PNG)](https://youtu.be/WiOv021PWm8 "SlugSlack Demonstration")

## Scripts
The following commands are meant to be run from the most parent directory of this repository.

```bash
# Install the required modules
npm install
```
```bash
# Start the database (uses port 5432, by default)
docker-compose up -d
```
```bash
# Run the development server (uses port 3000, by default)
npm run dev
```
```bash
npm run test:silent  # Run the tests 
npm run lint         # Run lint
npm run zip          # Zip the project
```
