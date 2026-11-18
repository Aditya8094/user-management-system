# User Management System

A full-stack User Management System built using the MERN stack, featuring secure authentication, role-based access control, user management, and profile management.

## 🚀 Features

- User Registration and Login
- Secure JWT Authentication
- Password Hashing using bcrypt
- Role-Based Access Control (Admin & User)
- Admin Dashboard
- User Dashboard
- Create, View, Update and Delete Users
- User Profile Management
- Password Change Functionality
- User Status Management (Active/Inactive)
- MongoDB Database Integration
- RESTful API Architecture

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- React Router
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

**Tools**
- Git & GitHub
- Postman
- MongoDB Atlas
- VS Code

## 📁 Project Structure

```text
user-management-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── postman/
├── .postman/
└── .gitignore
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Aditya8094/user-management-system.git
```

```bash
cd user-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure your environment variables in a `.env` file according to the backend configuration.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on the local Vite development URL shown in your terminal.

## 🔗 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get authenticated user |

### User Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get all users (Admin) |
| POST | `/api/users` | Create a user (Admin) |
| PUT | `/api/users/:id` | Update a user (Admin) |
| DELETE | `/api/users/:id` | Delete a user (Admin) |
| GET | `/api/users/me` | Get own profile |
| PATCH | `/api/users/me/profile` | Update own profile |

**Note:** Protected endpoints require a valid JWT token in the Authorization header.

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔐 User Roles

**Admin**
- Access the Admin Dashboard.
- Create and manage users.
- View registered users.
- Update and delete user accounts.

**User**
- Access the User Dashboard.
- View personal profile.
- Update profile information.
- Change password.

 🗄️ Database

MongoDB is used to store user information, authentication credentials, roles, and account status.

Passwords are securely hashed before being stored in the database.

## 👨‍💻 Author

**Aditya**

GitHub: [Aditya8094](https://github.com/Aditya8094)

## 📌 Repository

[User Management System – GitHub](https://github.com/Aditya8094/user-management-system)

---

*Developed as a Full-Stack Web Development Project.*
