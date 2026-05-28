import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "./usertable.css";
import toast from "react-hot-toast";

const UserTable = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/user-list",
        );

        setUsers(response.data);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };
    fetchUserData();
  }, []);

  const deleteUser = async (userID) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/user/delete/${userID}`,
      );

      //Remove user from the list of users based on userID
      setUsers((prevUser) => prevUser.filter((user) => user._id !== userID));

      toast.success(response.data.message, { position: "top-center" });
    } catch (error) {
      toast.error(`Error occured while deleting user: ${error}`, {
        position: "top-center",
      });
      console.log(error);
    }
  };

  return (
    <div className="userTable">
      <Link to="/add" className="btn btn-primary">
        Add User
        <i style={{ marginLeft: "5px" }} className="fa-solid fa-user-plus"></i>
      </Link>

      {users.length === 0 ? (
        <div className="noData">
          <h3>No data to show.</h3>
          <p>Add new users</p>
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Serial No.</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Address</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              return (
                <tr key={user._id || index}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td className="actionButtons">
                    <Link to={`/update/${user._id}`} className="btn btn-info">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                    <button
                      onClick={() => deleteUser(user._id)}
                      type="button"
                      className="btn btn-danger"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTable;
