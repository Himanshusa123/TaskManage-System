import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Task from "../models/Task.js";

// get user
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");

    // add task counts to each other
    const userwithtaskcount = await Promise.all(
      users.map(async (user) => {
        const pendingtasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "pending",
        });
        const inProgresstask = await Task.countDocuments({
          assignedTo: user._id,
          status: "progress",
        });
        const completedtask = await Task.countDocuments({
          assignedTo: user._id,
          status: "completed",
        });

        return {
          ...user._doc,
          pendingtasks,
          inProgresstask,
          completedtask,
        };
      })
    );
    res.json(userwithtaskcount);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get user by id

const getUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { getUserId, getUsers };
