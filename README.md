# Fundoo Notes

Fundoo Notes is a note-taking application designed to provide users with an easy and efficient way to manage their notes.

## Project Structure
```
fundooNotes/
│-- src/
│   ├── config/             # Configuration files
│   ├── controllers/        # Controllers handling business logic
│   ├── middlewares/        # Middleware functions
│   ├── models/             # Mongoose models
│   ├── routes/             # Route handlers
│   ├── services/           # Service layer for business logic
│   ├── utils/              # Utility functions
│   ├── index.js            # Main application setup
│-- .env                    # Environment variables
│-- .gitignore              # Git ignore file
│-- package.json            # Project dependencies and scripts
│-- README.md               # Project documentation
```

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/VineetChahal/fundooNotes.git
   ```
2. Navigate to the project directory:
   ```sh
   cd fundooNotes
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up environment variables in `.env` file.

## Running the Project
To start the application in development mode:
```sh
npm run dev
```
To start the application in production mode:
```sh
npm start
```

## API Endpoints
The application provides various API endpoints for note management. Check the `routes/` directory for details.

## Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication

