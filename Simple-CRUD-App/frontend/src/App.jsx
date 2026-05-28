import { Routes, Route } from "react-router-dom";

import "./App.css";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import UpdateUser from "./pages/UpdateUser";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/users" element={<Users />} />
        <Route path="/add" element={<AddUser />} />
        <Route path="/update/:id" element={<UpdateUser />} />
      </Routes>
    </div>
  );
};

export default App;