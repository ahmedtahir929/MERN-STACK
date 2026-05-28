# SSPMC - Smart Services Portal for Multan Citizens

SSPMC is a clean, modern web application built for the Multan district administration. It serves as a central digital directory that helps local citizens easily find, search, and manage important community places like **hospitals, restaurants, and public parks**.

---

## 🌟 Main Features

* **Easy Search & Filter:** Citizens can instantly search through listings by name or filter them by category (Hospitals, Restaurants, Parks).
* **Smart Quick-Navigation:** Clicking on any service entry inside your profile automatically takes you to that specific item on the services page, centers it on your screen, and highlights it with a clear green border.
* **Organized File Uploads:** When users upload images, the server automatically reads the category and sorts the files into organized folders (`/uploads/hospitals`, `/uploads/restaurants`, `/uploads/parks`) right on the server.
* **Instant Profile Updates:** Changing your profile picture updates the top navigation bar avatar instantly without requiring a page refresh or creating annoying layout jumps.
* **Secure Accounts:** Protects user accounts using secure passwords, JWT login tokens, and distinct permissions for standard **Users** and platform **Admins**.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, React Router, Tailwind CSS, React Icons
* **Backend:** Node.js, Express.js, Multer (for handling file uploads)
* **Database:** MongoDB, Mongoose (Optimized with search indexes for fast performance)

---

## 💻 Local Setup Guide

Follow these simple steps to run the project locally on your machine:

### 1. Enter the Project Folder
Open your terminal and navigate to the project directory:
```bash
cd "SSPMC - Smart Services Portal for Multan Citizens"
```

### 2. Setup and Run the Backend
```bash
cd backend
npm install
```
**📝 Note: Create a .env file in the backend folder and add your environment variables (PORT, MONGO_URI, JWT_SECRET).**
Now, start the backend server: 
```bash
node server.js
# Or run with nodemon for live development updates:
nodemon server.js
```

### 3. Setup and Run the Frontend
Open a new terminal window, navigate to the frontend folder, install the packages, and launch the interface:
```bash
cd frontend
npm install
npm run dev
```
**Open the link provided in your terminal (usually http://localhost:5173) to view and use the application!**