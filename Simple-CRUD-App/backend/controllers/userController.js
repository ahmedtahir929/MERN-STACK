import User from "../models/userModel.js";

export const create = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const { email } = newUser;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const savedData = await newUser.save();
    //res.status(201).json(savedData);
    res.status(201).json({ message: "User Created Successfully!" });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }

    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getUserByID = async (req, res) => {
  try {
    const { id } = req.params;
    const userExist = await User.findById(id);

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userExist = await User.findById(id);

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({ message: "User Updated Successfully!" });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userExist = await User.findById(id);

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};
