# Connectverse Authentication API

## Project Overview
Connectverse Authentication API is a Node.js-based RESTful API that handles user registration and authentication for a fictional social media platform called "Connectverse". The API implements secure signup, login, and JWT-based authentication.

## Features
- User signup with username, email, and password
- User login with username/email and password
- JWT-based authentication
- Password hashing using bcrypt
- MySQL database integration using Sequelize ORM

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js (v14 or later) installed
- MySQL server installed and running
- npm (usually comes with Node.js)

## Installation

1. Install the dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following content:
   ```
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=localhost
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```
   Replace the placeholders with your actual MySQL credentials and choose a strong JWT secret key.

4. Create the MySQL database:
   ```
   mysql -u root -p
   CREATE DATABASE your_database_name;
   ```

## Running the API

To start the API server, run:

```
npm start
```

The server will start running on `http://localhost:3000` (or the PORT you specified in the .env file).

## API Endpoints (with Examples)

### 1. Signup
- **URL**: `/signup`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "darshmashru2",
    "email": "hello2@darshmashru.com",
    "password": "Pass@123",
    "confirmPassword": "Pass@123",
    "name": "Darsh Mashru", // Optional
    "profilePicture": "http://example.com/profile.jpg" // Optional
  }
  ```
- **Success Response**: 
  - **Code**: 201
  - **Content**: `{ "message": "User registered successfully", "token": "JWT_TOKEN" }`

### 2. Login
- **URL**: `/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "darshmashru2",
    "password": "Pass@123"
  }
  ```
  or
  ```json
  {
    "email": "hello2@darshmashru.com",
    "password": "Pass@123"
  }
  ```
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "message": "Login successful", "token": "JWT_TOKEN" }`

### 3. Profile (Protected Route)
- **URL**: `/profile`
- **Method**: `GET`
- **Headers**: 
  - `Authorization: Bearer JWT_TOKEN`
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "message": "Access granted to protected route", "user": { "id": "user_id", "username": "username" } }`

### 4. Forgot Password
- **URL**: `/forgot-password`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "hello2@darshmashru.com"
  }
  ```
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "message": "Password reset link sent to your email" }`

### 5. Reset Password
- **URL**: `/reset-password`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "token": "RESET_TOKEN",
    "password": "NewPass@123"
  }
  ```

## Testing the API

You can test the API using tools like [curl](https://curl.se/). Here are some example curl commands:

1. Signup a new user:
   ```
   curl -X POST http://localhost:3000/signup \
     -H "Content-Type: application/json" \
     -d '{"username": "darshmashru2", "email": "hello2@darshmashru.com", "password": "Pass@123", "confirmPassword": "Pass@123"}'
   ```

2. Login:
   ```
   curl -X POST http://localhost:3000/login \
     -H "Content-Type: application/json" \
     -d '{"username": "darshmashru2", "password": "Pass@123"}'
   ```

3. Access protected route (Profile Page):
   ```
   curl -X GET http://localhost:3000/profile \
        -H "Authorization: Bearer <JWT>"
   ```
   Replace `JWT` with the token received from signup or login.

4. Forgot Password:
   ```
   curl -X POST http://localhost:3000/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email": "hello2@darshmashru.com"}'
   ```

5. Reset Password:
   ```
   curl -X POST http://localhost:3000/reset-password \
     -H "Content-Type: application/json" \
     -d '{"token": "RESET_TOKEN", "password": "NewPass@123"}'
   ```

## Proof

![Proof Image](proof_api.png)

## Error Handling

The API returns appropriate HTTP status codes and error messages for various scenarios, such as invalid input, duplicate usernames/emails, or authentication failures.

## Security Considerations

- Passwords are hashed using bcrypt before storage
- JWT tokens are used for stateless authentication
- Environment variables are used for sensitive information
- Input validation is performed on all endpoints