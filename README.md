# Full Stack Authentication App

A modern full-stack authentication system built with **Node.js**, **Express**, **MongoDB**, and **React**. This project demonstrates secure authentication using Access Tokens and Refresh Tokens, cookie-based session handling, and a modern frontend built with React + Vite.

---

## Features

- User authentication system
- Secure password hashing using **bcrypt**
- JWT authentication
- Access Token & Refresh Token implementation
- HTTP-only cookies for secure token storage
- Protected routes
- API communication using **Axios**
- Modern UI built with **React + Vite**
- Styled with **TailwindCSS**
- Data fetching and state management using **TanStack Query**

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Token)
- bcrypt
- Axios
- CORS
- Cookie Parser

### Frontend
- React.js
- Vite
- Axios
- TanStack Query
- TailwindCSS

---

## Authentication Flow

1. User registers with email and password.
2. Password is hashed using **bcrypt** before storing in MongoDB.
3. On login:
   - Server verifies credentials.
   - Generates **Access Token** (short-lived).
   - Generates **Refresh Token** (long-lived).
4. Tokens are stored securely using **HTTP-only cookies**.
5. When Access Token expires:
   - Frontend calls the refresh endpoint.
   - Server validates Refresh Token and issues a new Access Token.

---

## Project Structure
```
project-root
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── models
│   ├── utils
│   └── server.js
│
├── frontend
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── api
│   └── main.jsx
```

---

## Installation

### Clone the repository
```bash
git clone https://github.com/visal-uni/Scor.git
```

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
```

Run the server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## API Example

### Login
```
POST /api/auth/login
```

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

---

## Security Practices

- Password hashing with **bcrypt**
- JWT authentication
- Access / Refresh Token rotation
- HTTP-only cookies
- CORS protection

---

## Future Improvements

- Email verification
- OAuth login (Google / GitHub)
- Role-based authorization
- Rate limiting
- Account recovery system

---

## Author

**Cheng Sokvisal**
