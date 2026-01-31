# Student Management System

A modern, full-stack Student Management System built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## 🚀 Live Demo
The project is configured for deployment on Vercel.

## ✨ Features
- **Modern UI**: Clean, responsive dashboard built with Tailwind CSS.
- **Student Records**: Full CRUD (Create, Read, Update, Delete) functionality.
- **Auto-Generation**: Student codes (e.g., `STU_0001`) are automatically generated.
- **Calculated Fields**: Age is auto-calculated based on the birth date.
- **Search & Filter**: Real-time searching by name, city, district, or student code.
- **Validation**: Form validation for contact numbers and dates.

## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Axios, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas).
- **Deployment**: Vercel.

## 📁 Project Structure
```
StudentManagementSystem/
├── backend/               # Node.js + Express API
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   └── server.js         # Entry point
├── frontend/              # Vite + React App
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── services/     # API service (Axios)
│   │   └── types/        # TypeScript interfaces
│   └── vite.config.ts    # Frontend config
└── vercel.json           # Vercel deployment config
```

## ⚙️ Local Setup

### Prerequisites
- Node.js installed.
- MongoDB Atlas account (or local MongoDB).

### 1. Clone the repository
```bash
git clone https://github.com/abdullah3034/StudentManagementSystem.git
cd StudentManagementSystem
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

## 🚢 Deployment (Vercel)

This project is optimized for Vercel.

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add the following **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `NODE_ENV`: `production`
4. Deploy!

---
Built with ❤️ by [Abdullah](https://github.com/abdullah3034)
