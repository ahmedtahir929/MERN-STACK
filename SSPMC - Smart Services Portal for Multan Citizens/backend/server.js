import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import passport from 'passport';

import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import serviceRouter from "./routes/serviceRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';

import './config/passport.js'; // Loads and initializes the Google Strategy
import newsletterRouter from "./routes/newsletterRoutes.js";

dotenv.config();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();
const app = express();

// Configure CORS cleanly for Axios communication
app.use(cors({
    origin: `http://localhost:5173`, // Frontend application URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

//static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads/avatars')));
app.use('/uploads/hospitals', express.static(path.join(__dirname, 'uploads/hospitals')));
app.use('/uploads/restaurants', express.static(path.join(__dirname, 'uploads/restaurants')));
app.use('/uploads/parks', express.static(path.join(__dirname, 'uploads/parks')));

// Endpoints routing
app.use("/api/users", userRouter);
app.use("/api/services", serviceRouter);
app.use("/api/contact", contactRouter);
app.use("/api/newsletter", newsletterRouter);

app.listen(PORT, () => {
    console.log(`Server active at port:${PORT}`);
});