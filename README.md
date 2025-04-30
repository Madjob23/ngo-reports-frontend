# NGO Impact Reports

A comprehensive platform for NGOs to submit and track their impact metrics. The application allows NGOs to report their monthly activities, including people helped, events conducted, and funds utilized. Administrators can view a dashboard with aggregated data across all NGOs and examine individual reports.

## Live Demo

**Deployed Link**: [https://ngo-impact-reports.vercel.app/](https://ngo-impact-reports.vercel.app/)

## [Video Demo](https://drive.google.com/file/d/1N-rz3SCNQZj6nviwFiZGjlggjJDetmEB/view?usp=drive_web)

## Tech Stack

### Frontend
- **Next.js 14**: App Router for server components and client-side rendering
- **React**: UI library for building the user interface
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Reusable UI components built with Radix UI and Tailwind
- **React Hook Form**: Form handling and validation
- **Sonner**: Toast notifications
- **Next Auth**: Authentication and session management
- **Zustand**: State management

### Backend
- **MongoDB**: NoSQL database for storing user data and reports
- **Mongoose**: MongoDB object modeling for Node.js
- **NextAuth.js**: Authentication framework
- **API Routes**: Next.js API routes for server endpoints

### Deployment
- **Vercel**: Hosting platform for the application

## Features

- **User Authentication**: Secure login for NGOs and administrators
- **Role-Based Access Control**: Different permissions for NGOs and administrators
- **Report Submission**: NGOs can submit monthly impact reports
- **Dashboard**: Comprehensive view of aggregated impact metrics
- **Month Filtering**: Filter reports and dashboard data by month
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Setup Instructions

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn
- MongoDB database (local or Atlas)

### Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Optional: for production
# VERCEL_URL=your_vercel_url
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/ngo-reports-frontend.git
cd ngo-reports-frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Seeding (Optional)
To seed the database with sample data:

```bash
npm run seed
# or
yarn seed
```
#### Sample user credentials (username, password)
1. admin, admin123 (administrator)
2. madjob, madjob1 (NGO)
3. madjob2, madjob2 (NGO)
4. madjob3, madjob3 (NGO)

## Deployment

The application is set up for easy deployment on Vercel:

1. Fork this repository
2. Connect your fork to Vercel
3. Set up the environment variables in Vercel project settings
4. Deploy!
