# Student Management System

A full-stack web application for managing student records built with the MERN stack.

## Tech Stack

- **Backend**: Node.js + Express (JavaScript)
- **Frontend**: React + TypeScript + Vite
- **Database**: MongoDB
- **Styling**: Tailwind CSS

## Features

✅ **Create Students** - Add new student records with auto-generated student codes (STU_0001, STU_0002, etc.)  
✅ **List Students** - View all students in a searchable table  
✅ **View Details** - See complete student information  
✅ **Edit Students** - Update student records (student code is immutable)  
✅ **Delete Students** - Remove records with confirmation  
✅ **Auto-calculated Age** - Age computed from birth date as of 01/01/2025  
✅ **Form Validation** - 10-digit contact number, past date for birth date  
✅ **Search** - Filter students by code, name, city, or district  

## Student Fields

- **Student Code**: Auto-generated (STU_0001, STU_0002...), read-only
- **Name**: First Name, Middle Name (optional), Last Name
- **Birth Date**: Date picker (DD/MM/YYYY format)
- **Age**: Auto-calculated from birth date, read-only
- **Address**: Line 1, Line 2 (optional), City, District (dropdown)
- **Contact Number**: 10-digit validation

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB running on localhost:27017

### Backend Setup
```bash
cd StudentManagementSystem
npm install
npm run dev
```
Backend runs on **http://localhost:5000**

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

## API Endpoints

- `POST /api/students` - Create new student
- `GET /api/students?search=term` - List/search students
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

## Environment Variables

Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studentdb
```

## Project Structure

```
StudentManagementSystem/
├── server.js                 # Express server
├── .env                      # Environment config
├── models/
│   └── Student.js           # Student schema
├── controllers/
│   └── studentController.js # CRUD logic
├── routes/
│   └── studentRoutes.js     # API routes
└── frontend/
    ├── src/
    │   ├── App.tsx          # Main app
    │   ├── components/      # React components
    │   ├── services/        # API services
    │   └── types/           # TypeScript types
    └── package.json
```

## Development

- Backend: `npm run dev` (uses nodemon)
- Frontend: `npm run dev` (uses Vite)

## Notes

- Student codes are auto-generated and cannot be edited
- Age is calculated as of 01/01/2025 reference date
- All dates display in DD/MM/YYYY format
- Search works across multiple fields simultaneously

---

Built with ❤️ using MERN Stack
