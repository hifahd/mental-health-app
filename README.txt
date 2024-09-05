Mental Health Support App
=========================

This project consists of a backend API built with Node.js and Express, and a frontend application built with React.

Setup and Running Instructions
------------------------------

1. Backend Setup:
   a. Navigate to the backend directory:
      cd backend

   b. Install dependencies:
      npm install

   c. Create a .env file in the backend directory with the following content:
      MONGODB_URI=mongodb://localhost:27017/mental_health_app
      PORT=5000
      JWT_SECRET=your_jwt_secret_here

   d. Start the backend server:
      npm start

   The backend should now be running on http://localhost:5000

2. Frontend Setup:
   a. Open a new terminal window/tab
   
   b. Navigate to the frontend directory:
      cd frontend

   c. Install dependencies:
      npm install

   d. Start the frontend development server:
      npm start

   The frontend should now be running on http://localhost:3000

3. Using the Application:
   - Open your web browser and go to http://localhost:3000
   - You can now sign up, log in, and use the mood tracking features

4. API Endpoints:
   - POST /api/auth/signup - Create a new user account
   - POST /api/auth/login - Log in to an existing account
   - POST /api/mood - Create a new mood entry (requires authentication)
   - GET /api/mood - Get all mood entries for the authenticated user
   - POST /api/activity - Create a new activity entry (requires authentication)
   - GET /api/activity - Get all activity entries for the authenticated user

5. Troubleshooting:
   - If you encounter CORS issues, ensure the backend CORS settings in server.js match your frontend URL
   - Check that MongoDB is running on your system
   - Verify that all environment variables in the .env file are set correctly

6. Development:
   - Backend code is in the 'backend' directory
   - Frontend code is in the 'frontend/src' directory
   - Main components are in 'frontend/src/components'

Remember to keep your JWT_SECRET secure and never commit your .env file to version control.