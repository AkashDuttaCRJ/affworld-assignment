# Affworld Assignment

This repository contains the code for both the backend and frontend required for the Affworld assignment in their respective folders.

## Features Implemented

- [x] User Authentication (Login, Register, Logout)
- [x] Reset Password
- [ ] Google OAuth
- [x] CRUD operations on Tasks (Create, Modify / Reorder, Delete)
- [x] Post Feed w/ Pagination
- [x] Create New Posts

## Backend

The backend is a simple REST API built using Node.js, Express.js and MongoDB.

## Frontend

The frontend is a simple React application that consumes the REST API provided by the backend.

## Setup

The setup instructions for both the backend and frontend is identical. The instructions are as follows:

1. Clone the repository
2. Navigate to the respective folder (backend or frontend)
3. Run `npm install` to install the dependencies
4. Create a `.env` file in the root of the folder and copy the contents of the `.env.example` file
5. Fill in the required environment variables in the `.env` file

## Running the Application

To run the backend, navigate to the backend folder and run `npm start`. The backend will be running on `http://localhost:8080`.
To run the frontend in production mode, navigate to the frontend folder and run `npm run build`. The frontend will be built in the `build` folder. To run the frontend in development mode, run `npm start`. The frontend will be running on `http://localhost:5173`.
Even though both the backend and frontend are in the same repository, they can be hosted separately or together (using concurrently).
