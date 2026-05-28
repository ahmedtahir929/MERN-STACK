import express from "express";

import {
  create,
  deleteUser,
  getAllUsers,
  getUserByID,
  updateUser,
} from "../controllers/userController.js";

const route = express.Router();

//get endpoints
route.get("/user-list", getAllUsers);
route.get("/:id", getUserByID);

//post endpoints
route.post("/create", create);

//put endpoints
route.put("/update/:id", updateUser);

//delete endpoints
route.delete("/delete/:id", deleteUser);

export default route;
