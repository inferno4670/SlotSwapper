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