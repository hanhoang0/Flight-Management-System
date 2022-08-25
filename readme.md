**Introduction**

Flight Management System is my first full-stack project for my Design of File and Database Systems class. It is a Javascript-based web application that allows users to view, create, update and delete any information about flights, boarding and airplanes. For example, in boarding tab, you can view extra information of the boarding gate and in airplane tab, you can view extra information of maintenance, service of the airplane and so on.

**Programming Languages**: Javascript, SQL, HTML

**Dependencies**: express, cors, pg, express-handlebars

**How to get started**
1. cd to hw3 folder in the terminal
2. Install the dependencies
- Run "npm init -y"
- Run "npm i express pg cors express-handlebars"

3. Install Nodemon to restart express server
- Run "npm install --save-dev nodemon"

4. Open package.json file, under scripts, add this line: "start": "nodemon app.js"

So that it looks like this:

    "scripts": {  
  
    "test": "echo \"Error: no test specified\" && exit 1",
    
    "start": "nodemon app.js"}

5. In the terminal, run 'npm run start' to start the local server
6. Open Google Chrome, go to localhost:3000 to open the home page of web application


