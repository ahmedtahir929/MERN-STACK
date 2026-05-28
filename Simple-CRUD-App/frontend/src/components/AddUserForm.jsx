import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import toast from "react-hot-toast";

const AddUserForm = () => {
  const users = {
    name: "",
    email: "",
    address: "",
  };
  const [user, setUser] = useState(users);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/create",
        user,
      );
      toast.success(response.data.message, { position: "top-center" });

      navigate("/");
    } catch (error) {
      toast.error(`Error occured while creating user: ${error}`, {position: "top-center"});
      console.error("Error occurred while creating user:", error);
    }
  };

  return (
    <div>
      <form className="addUserForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            onChange={inputHandler}
            name="name"
            autoComplete="off"
            placeholder="E.g, John"
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            onChange={inputHandler}
            name="email"
            autoComplete="off"
            placeholder="E.g, john@example.com"
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            onChange={inputHandler}
            name="address"
            autoComplete="off"
            placeholder="E.g, abc street"
          />
        </div>
        <div className="inputGroup">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
