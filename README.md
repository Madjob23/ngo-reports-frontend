# NGO Impact Reporting System

A web application for NGOs to submit monthly impact reports and for administrators to view aggregated data via a dashboard.

## Project Overview

This full-stack application consists of:

1. **Backend**: Node.js with Express and MongoDB
2. **Frontend**: Next.js with TailwindCSS and Shadcn UI components

## Features

- **Authentication**: Secure login for NGO users and administrators
- **Report Submission**: Form for NGOs to submit monthly impact metrics
- **Report Management**: View, edit, and delete submitted reports
- **Admin Dashboard**: View aggregated statistics for selected months
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### Backend Setup

1. **Clone the repository and navigate to the backend folder**:
   ```bash
   git clone <repository-url>
   cd ngo-impact-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a .env file** with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Create an admin user**:
   ```bash
   npm run create-admin
   ```
   This will create an admin user with:
   - Username: admin
   - Password: admin123

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   The backend server will run on http://localhost:5000

### Frontend Setup

1. **Navigate to the frontend folder**:
   ```bash
   cd ../ngo-impact-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a .env.local file** with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:3000

## Using the Application

### Login Credentials

- **Admin User**:
  - Username: admin
  - Password: admin123

- **NGO User**:
  - NGO users can be created by the admin through the application

### NGO User Workflow

1. Log in with NGO credentials
2. Submit monthly reports using the submission form
3. View and edit past submissions

### Admin Workflow

1. Log in with admin credentials
2. View the dashboard to see aggregated metrics
3. Filter data by month
4. View all reports from all NGOs
5. Create new NGO users

## Project Structure

### Backend

```
ngo-impact-backend/
├── config/         # Database configuration
├── controllers/    # Request handlers
├── middleware/     # Authentication middleware
├── models/         # Database models
├── routes/         # API routes
├── scripts/        # Utility scripts
├── .env            # Environment variables
├── index.js        # Main application file
└── package.json    # Dependencies
```

### Frontend

```
ngo-impact-frontend/
├── public/            # Static files
├── src/
│   ├── app/           # Page components
│   ├── components/    # Reusable UI components
│   ├── services/      # API service functions
│   └── store/         # State management
├── .env.local         # Environment variables
└── package.json       # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user (admin only)
- `GET /api/auth/profile` - Get current user profile

### Reports
- `GET /api/reports` - Get all reports (filtered by NGO ID for NGO users)
- `POST /api/reports` - Submit a new report
- `GET /api/reports/:id` - Get a specific report
- `PUT /api/reports/:id` - Update a report
- `DELETE /api/reports/:id` - Delete a report (admin only)

### Dashboard
- `GET /api/dashboard?month=YYYY-MM` - Get dashboard data for a specific month

## Technologies Used

- **Backend**:
  - Node.js and Express
  - MongoDB with Mongoose ODM
  - JSON Web Tokens (JWT) for authentication
  - bcryptjs for password hashing

- **Frontend**:
  - Next.js 14 with App Router
  - TailwindCSS for styling
  - Shadcn UI components
  - React Hook Form for form handling
  - React Query for data fetching
  - Zustand for state management

## Credits

Created as a project for tracking and reporting NGO impact across India.