# Fundoo Notes

## Overview
Fundoo Notes is a note-taking application built using Node.js, Express, and MongoDB. This module focuses on user authentication and authorization features.

## Features
- User Registration
- User Login with JWT Authentication
- Password Encryption using bcrypt
- Protected Routes with Middleware Authentication
- Notes - can perform CRUD Operations

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Other:** dotenv

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/VineetChahal/fundooNotes.git
   cd fundooNotes
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file and add the required environment variables.
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. Run the server:
   ```sh
   npm start
   ```

