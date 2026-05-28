# Simple CRUD Application

A foundational full-stack web application built using the MERN stack to demonstrate clean database Operations (Create, Read, Update, Delete) and API architecture.

## 🛠️ Tech Stack

- **Frontend:** React.js, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose

## 🚀 Features

- **Create:** Add new data records via structured forms.
- **Read:** Live data streams fetched directly from MongoDB.
- **Update:** Inline editing and modification profiles for entries.
- **Delete:** Drop entries instantly with clean tracking cleanup.

## 💻 Local Setup

1. **Clone the repository and navigate here:**
   cd Simple-CRUD-App

2. **Setup Backend:**
   cd backend
   npm install

# Create a .env file with your MONGO_URI and PORT then run the command to run the server

node index.js

# Or run the backend with nodemon

nodemon index.js

3. **Setup Frontend:**
   cd ../frontend
   npm install
   npm run dev