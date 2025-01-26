# Affworld Assignment

This repository contains the code for both the backend and frontend required for the Affworld assignment in their respective folders.

## Features Implemented

- [x] User Authentication (Login, Register, Logout)
- [x] Reset Password
- [x] Google OAuth
- [x] CRUD operations on Tasks (Create, Reorder, Delete)
- [x] Post Feed
- [x] Create New Posts

## Backend

The backend is a simple REST API built using Node.js, Express.js and MongoDB.

## Frontend

The frontend is a simple React application that consumes the REST API provided by the backend.

## Prerequisites

Before running this project, ensure you have the following dependencies and credentials set up:

### 1. MongoDB Connection URL

To connect the project to your MongoDB database, you need to provide a valid connection URL.

- **Step 1:** Create a MongoDB database using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or your local installation.
- **Step 2:** Obtain the connection string from your MongoDB instance.
- **Step 3:** Add the connection URL to your environment file:
  ```env
  MONGODB_URI=your_mongodb_connection_string
  ```

### 2. Google Auth Credentials

To enable Google authentication in your project, follow these steps to obtain credentials:

- **Step 1:** Go to the [Google Cloud Console](https://console.cloud.google.com/).
- **Step 2:** Create a new project and navigate to "APIs & Services" > "Credentials".
- **Step 3:** Set up OAuth 2.0 credentials and get your `CLIENT_ID` and `CLIENT_SECRET`.
- **Step 4:** Add the credentials to your environment file:
  ```env
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  GOOGLE_REDIRECT_URI=your_google_redirect_uri
  ```

### 3. Cloudinary Credentials

Cloudinary is used for image uploading and storage. To configure Cloudinary in the project:

- **Step 1:** Sign up at [Cloudinary](https://cloudinary.com/) and create an account.
- **Step 2:** Navigate to your account dashboard to find your API credentials.
- **Step 3:** Add the credentials to your environment file:
  ```env
  VITE_CLD_CLOUD_NAME=your_cloud_name
  VITE_CLD_UNSIGNED_UPLOAD_PRESET=your_unsigned_upload_preset
  VITE_CLD_API_KEY=your_api_key
  VITE_CLD_API_SECRET=your_api_secret
  ```

## Setup

The setup instructions for both the backend and frontend is identical. The instructions are as follows:

1. Clone the repository:
   ```sh
   git clone https://github.com/AkashDuttaCRJ/affworld-assignment.git
   ```
2. Navigate to the respective folder (backend or frontend).
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file in the root of the folder and copy the contents of the `.env.example` file.
5. Fill in the required environment variables in the `.env` file as mentioned in the prerequisites.
6. Run the project:
   ```sh
   npm run dev
   ```

## Deployment

The steps to deploy both the backend and frontend is identical as well.

1. Create production build:
   ```sh
   npm run build
   ```
2. Start the server:
   ```sh
   npm start
   ```
