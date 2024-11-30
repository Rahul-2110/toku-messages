# Toku Messages Service Documentation

## Overview

Toku Messages is a messaging service that provides CRUD operations for messages along with additional functionalities such as chat management and user authentication. The service is built using in Node.js with Express for the server framework and MongoDB as the database, utilizing Mongoose for data modeling in TypeScript.

## Features

- **User Authentication**: Secure login and registration processes with JWT for handling sessions.
- **Message Handling**: Sending, receiving, and updating message statuses.
- **Chat Management**: Starting new chat sessions and retrieving chat histories.
- **Rate Limiting**: IP-based and user-based rate limiting to prevent abuse.  // user-based rate limiting is disabled for now
- **Data Validation**: Robust request validation using Joi.

## Technical Stack

- **TypeScript**: JavaScript with static typing for improved code quality and maintainability.
- **Node.js**: Runtime environment for the backend.
- **Express**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing user and message data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (JSON Web Tokens)**: For securely transmitting information between parties as a JSON object.
- **Joi**: Powerful schema description language and data validator for JavaScript.
- **Docker**: For containerizing the application and ensuring it works uniformly across different environments.

## Directory Structure

- `src/`: Source files for the application.
  - `db/`: Database models and connection setup.
  - `middlewares/`: Express middlewares for authentication and rate limiting.
  - `routes/`: Route definitions for the application.
  - `utils/`: Utility functions including validators and JWT utilities.
  - `config.ts`: Configuration management using convict.
  - `app.ts`: Entry point for the Express application.
- `dist/`: Compiled JavaScript files from the TypeScript source.
- `node_modules/`: Node.js packages.
- `Dockerfile`: Docker configuration file for building the application image.
- `docker-compose.yml`: Docker Compose configuration for running multi-container Docker applications.
- `package.json`: Project metadata and dependency management.
- `tsconfig.json`: Configuration file for TypeScript.

## Key Components

### Models

- **User**: Handles user data and includes methods for password comparison and finding users by username.
- **Message**: Manages message data with methods to find messages by chat ID and update message statuses.
- **Chat**: Manages chat sessions, including methods to start new chats, find chats by participants, and check user participation in chats.

### Routes

- **Auth Routes (`auth.routes.ts`)**: Endpoints for user registration and login.
- **Chat Routes (`chat.routes.ts`)**: Endpoints for starting chats, listing chats, and retrieving chat details.
- **Message Routes (`messages.routes.ts`)**: Endpoints for sending messages, retrieving message details, and updating message statuses.

### Middleware

- **Authentication Middleware (`auth.ts`)**: Validates JWTs and sets the user in the request object.
- **Rate Limiting (`rateLimit.ts`)**: Limits the number of requests that can be made to the API from a single IP or user.

### Utilities

- **JWT Utilities (`jwtUtils.ts`)**: Functions for generating and verifying JWTs.
- **Validators (`validator/`)**: Joi schemas for validating request data.
 **Kafka (`kafka/`)**: Interaction with Kafka topics for message queuing and chat status updates. This feature is currently disabled pending further integration testing.

## Setup and Deployment

### Local Setup

1. Ensure Node.js and MongoDB are installed.
2. Clone the repository and navigate to the project directory.
3. Check `src/config.json` for the configuration details.
3. Install dependencies: `npm install`.
4. Compile TypeScript to JavaScript: `npm run build`.
5. Start the application: `npm start`.


### Using Docker

1. Check `docker-compose.yml` for the configuration details.
1. Run the application using Docker Compose: `docker-compose up`.

Application will be available at `http://localhost:3000`. (Default port is 3000, can be changed in `docker-compose.yml`)


## API Documentation

Endpoints are structured under `/api/v1/` and include:

- `POST /login`: Authenticate users.
- `POST /register`: Register new users.
- `POST /chat/start`: Start a new chat session.
- `GET /chat/:chat_id`: Retrieve chat details.
- `GET /chat/list`: List all chats for a user. 
- `GET /chat/:chat_id/messages`: List all messages in a chat. 
- `POST /message`: Send a new message.
- `GET /message/:message_id`: Retrieve message details.
- `PATCH /message/:messageId/status`: Update the status of a message. 

`toku_messages.postman_collection.json` - Postman collection for APIs

**Note: Chats and Message APIs only work if user is participant in chat, if user is not participant in chat then it will return 404 error**

APIs apart from login and register requires JWT token to be passed in header, you can get this token by logging in to the application using login api. Add this token in `Authentication` header in all the api calls by attaching it in the format `Bearer <token>`.

## Security

JWTs are used for session management, and passwords are hashed using bcrypt before storage. Rate limiting is applied to prevent brute force attacks and abuse of the API.

APIs apart from login and register requires JWT token to be passed in header.

## Conclusion

Toku Messages provides a robust backend for messaging applications, featuring secure user management, efficient message handling, and scalable chat functionalities. The use of modern technologies and practices ensures a reliable and maintainable service.

## Improvements
- Implement message queue to asyncrounously process messages with Kafka
- Better message status management with sockets and notifications
- Implement sockets for realtime connection
- More roboust user authentication
- logged in user to create chats & messages


## Note 

In `docker-compose.yml` lower version of mongo is used for compatibility with older versions of docker desktop, if you are using newer version of docker desktop you can use latest version of mongo
- mongo:4.4.29 - version used
- mongo:latest - latest version

