import React from "react";

import { Link } from "react-router-dom";

import UpdateUserForm from "../components/UpdateUserForm";
import "./updateuser.css";

const UpdateUser = () => {
  return (
    <div className="updateUser">
      <Link to="/" className="btn btn-secondary">
        <i
          className="fa-solid fa-arrow-left"
          style={{ marginRight: "5px" }}
        ></i>
        Go Back
      </Link>

      <h3>Update User</h3>
      <UpdateUserForm />
    </div>
  );
};

export default UpdateUser;
