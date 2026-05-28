import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AddUserForm from "../components/AddUserForm"
import "./adduser.css";

const AddUser = () => {
  return (
    <div className="addUser">
      <Link to="/" className="btn btn-secondary">
        <i className="fa-solid fa-arrow-left" style={{ marginRight: "5px" }}></i>
        Go Back
      </Link>
      <h3>Add New User</h3>
      <AddUserForm />
    </div>
  );
};

export default AddUser;
