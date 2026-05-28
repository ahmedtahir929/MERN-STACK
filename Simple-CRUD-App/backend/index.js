import express from "express";
import mongoose, { mongo } from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/user", route);

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//MonogoDB connection setup
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } 
  catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();