# CRUD of Events

This repository contains a Node.js and MongoDB application that implements basic CRUD operations for users and events. The users have a register and login functionality. It utilizes the Express.js framework for handling routes, bcrypt.js for password hashing, and JSON Web Token for tokenization and MongoDB for data storage.

You can view the project at <https://crud-of-events.onrender.com>

## Prerequisites

Befor running the application, make sure you [Node.js (v12 or higher)](https://nodejs.org/en) and [Git](https://git-scm.com/downloads) installed.

## Installation

1. Clone this repository using Git\
   `git clone https://github.com/Uju-Chinedum/CRUD-of-Event.git`

2. Navigate to the project directory\
   `cd CRUD-of-Account`

3. Install the required dependencies\
   `npm install`

4. Create a MongoDB database locally or via a cloud-based service. Make a note of the URL for the connection.

5. Create a `.env` file in the project root and add the following environment variables with your own values:\
   `MONGO_URI=<your-mongodb-connection-url>`\
   `JWT_SECRET=<your-key-to-tokenize-JWT>`\
   `JWT_LIFETIME=<how-long-you-want-it-to-last>`

## Running the Application

Once you have completed the installation, run the application by using `npm start`. This will start the Node.js server, and you should see the message "Server started on port `port`" in the console. The application will be available at <http://localhost:5000>.

## Routes

The application implements the following routes:

### User Routes

- **POST /api/v1/users/sign-up**: Creates a new user
- **POST /api/v1/users/sign-in**: Authenticate user login credentials and start a session

### Event Routes

- **POST /api/v1/events**: Creates a new event
- **GET /api/v1/events/:id**: Gets a specific event by ID
- **DELETE /api/v1/events/:id**: Delete an event by ID
- **GET /api/v1/events/day/:dayOfWeek?**: Gets a specific event by day of week
- **DELETE /api/v1/events/day/:dayOfWeek**: Delete events from day of week

## Usage

After the application is running, you can use an API testing tool like Postman to interact with the routes.

1. Create a new user by making a POST request to /api/v1/users/sign-up with the required user details in the request body.

2. To log in, make a POST request to api/v1/users/sign-in with valid login credentials (email and password) in the request body. This will authenticate the user and create a session.

3. Create a new event by making a POST request to /api/v1/events with the required event details in the request body.

4. Get all events by making a GET request to /api/v1/events/day/:dayOfWeek?. This gets all events for the day specified or all events if no day is specified.

5. Get a specific event by making a GET request to /api/v1/events/:id, where :id is the ID of the event you want to get.

6. Delete all events from a day of week by making a DELETE request to /api/v1/events/day/:dayOfWeek. This delete all events for the day specified.

7. Delete a specific event by making a DELETE request to /api/v1/events/:id, where :id is the ID of the event you want to delete.

Please note, all delete operations can only be performed by the user who creates the events but the GET request is accessible to any user that has logged in.

To create a new user, the following fields are needed in the request body. Asterisks are required fields:

    firstName       *
    lastName        *
    city            *
    country         *
    email           *
    password        *
    confirmPassword *

To create a new event, the following fields are needed in the request body. Asterisks are required fields:

    description       *
    dayOfWeek         Default is "saturday"

## License

This project is licensed under the **[MIT License](https://mit-license.org/)**

## Resources

- [Node.js](nodejs.org) - Official website for Node.js
- [NPM](npmjs.com) - Official website for NPM
- [Express.js](expressjs.com) - Official website for Express.js
- [MongoDB](mongodb.com) - Official website for MongoDB
- [Mongoose.js](mongoosejs.com) - Official website for Mongoose
- [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js/blob/master/README.md) - Official website for Bcrypt.js
- [JSON Web Token](https://jwt.io) - Official website for JWT
