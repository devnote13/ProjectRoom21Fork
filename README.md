# 🔥 SnowFall Casino

### Note: There are a lot of things i did not add games ect. I got tired and bored if your here please fork it and write games ect. for it hmmm bye <exit> 
"
A full-stack casino-style web application featuring user accounts, virtual chips, games, and an admin dashboard.

## 📌 About

SnowFall Casino is a web-based gaming platform designed with a modern casino-style interface. The project includes a frontend experience, backend API system, authentication, database management, and an administrator control panel.

This project was created as a learning experience in full-stack web development.

---

# ✨ Features

## 👤 User System
- User registration
- User login/logout
- Secure password handling
- JWT authentication
- User profiles
- User roles (User/Admin)
- Avatar support

## 💰 Virtual Economy
- Virtual chips system
- Player balances
- Withdraw request system
- Transaction management

## 🎮 Games Interface
- Casino-style game lobby
- Game cards
- Trending games section
- Classic games section
- Custom UI designs

## 🛠 Admin Dashboard

Admin-only control panel with:

- Admin authentication
- User management
- View all users
- Search users
- Sort users
- Ban users
- Unban users
- View withdrawal requests
- Approve/reject withdrawals
- Leaderboard system
- Statistics dashboard

---

# 🖥 Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript

## Backend
- Node.js
- Express.js
- TypeScript

## Database
- Supabase / PostgreSQL

## Authentication
- JWT Tokens
- Role-based access control

---

# 📂 Project Structure

```
SnowFall-Casino/

├── public/
│   ├── index.html
│   ├── games/
│   ├── admin/
│   │   ├── admin.html
│   │   ├── admin-login.html
│   │   └── style.css
│   ├── css/
│   └── js/
│
├── src/
│   ├── server.ts
│   ├── routes/
│   ├── database/
│   └── middleware/
│
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🚀 Installation

## 1. Clone the repository

```bash
git clone <repository-url>
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create a `.env` file:

```env
PORT=3000

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

JWT_SECRET=your_secret_key
```

## 4. Start development server

```bash
npm run dev
```

The website will run at:

```
http://localhost:3000
```

---

# 🔐 Admin Access

Admins use role-based authentication.

A user must have:

```
role = admin
```

in the database to access the admin panel.

Admin features are protected with JWT verification.

---

# 🛡 Security

Implemented:

- Password hashing
- JWT authentication
- Protected admin routes
- Role verification
- Authorization headers
- Server-side permission checks

---

# 🧩 Future Improvements

Possible future updates:

- More casino games
- Better anti-cheat system
- User achievements
- Multiplayer games
- Notifications
- Improved mobile support
- More advanced analytics

---

# 📚 What I Learned

This project helped improve skills in:

- Full-stack development
- Backend APIs
- Authentication systems
- Database design
- Frontend UI development
- Debugging complex applications
- Building complete web systems

---

# ⚠️ Disclaimer

This project is for educational purposes.

It uses virtual currency only and does not process real-money gambling transactions.

---

# 👨‍💻 Author

Created by **devnote13**
