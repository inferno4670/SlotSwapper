# SlotSwapper

A peer-to-peer calendar app where users can mark busy slots as *swappable* and exchange them with other users.

## Overview

SlotSwapper is a full-stack web application that allows users to:
- Manage personal events
- Mark and view swappable slots
- Request and approve slot swaps with other users
- View real-time updates in their calendar

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

### Frontend
- React with TypeScript
- React Router for navigation
- Axios for API requests

## Setup Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or cloud)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login

### Events
- `GET /api/events` - Get all events for user
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Slot Swapping
- `GET /api/swappable-slots` - Get all swappable slots (excluding requester's)
- `POST /api/swap-request` - Create swap request
- `POST /api/swap-response/:requestId` - Respond to swap request

## Deployment

### MongoDB Atlas Setup
1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (M0 free tier)
3. Create a database user with read/write permissions:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" as the authentication method
   - Enter a username and strong password
   - Set user privileges to "Atlas Admin" or "Read and write to any database"
4. Add your IP address to the whitelist:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For testing, you can use "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, add only specific IP addresses
5. Get the connection string:
   - Go to "Clusters" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/slotswapper?retryWrites=true&w=majority`

### Backend Deployment (Render)
1. Sign up at https://render.com/
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the following environment variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string (make sure to use the actual password, not `<password>`)
   - `JWT_SECRET`: A strong secret key (generate a random string)
   - `NODE_ENV`: production
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Set root directory: `backend`

### Frontend Deployment (Vercel)
1. Sign up at https://vercel.com/
2. Create a new project
3. Connect your GitHub repository
4. Configure the project:
   - Framework: Create React App
   - Root Directory: Leave as default (root)
   - Install Command: `cd frontend && npm install`
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/build`
5. Set the following environment variables:
   - `REACT_APP_API_URL`: Your deployed backend URL (e.g., https://your-app.onrender.com/api)

### Vercel Configuration
This project includes a `vercel.json` file that configures the build process for deployment. The configuration ensures that:
- The frontend is built correctly from the `frontend` directory
- Static assets are served properly
- The build output is directed to the correct directory
- Install and build commands are explicitly specified

The specific configuration used by Vercel is:
- **Install Command**: `cd frontend && npm install` (changes to frontend directory and installs dependencies)
- **Build Command**: `cd frontend && npm run build` (changes to frontend directory and runs build)
- **Output Directory**: `frontend/build` (where the built files are located)

This approach explicitly changes to the frontend directory before running npm commands, which should resolve the permission issues with react-scripts.

## Troubleshooting

### MongoDB Connection Issues
If you see "Error: bad auth : authentication failed":
1. Double-check your `MONGO_URI` environment variable
2. Ensure the username and password are correct
3. Make sure the IP address is whitelisted in MongoDB Atlas
4. Verify the cluster URL is correct

### Vercel Deployment Issues
If the frontend build fails:
1. Ensure the `vercel.json` file is in the root directory
2. Check that the build and output directories are correctly specified
3. Verify environment variables are set correctly
4. Make sure the install and build commands are correct
5. Confirm the `frontend` directory exists and contains the React application

## Known Issues and Assumptions

1. The application assumes a MongoDB database is available
2. Real-time updates are not yet implemented (planned for future releases)
3. Error handling could be more comprehensive
4. Input validation is basic and could be improved

## Future Enhancements

1. Implement WebSocket notifications for real-time updates
2. Add more comprehensive input validation
3. Implement password reset functionality
4. Add user profile management
5. Improve UI/UX with better styling and responsiveness