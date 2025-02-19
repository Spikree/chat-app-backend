import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
  const userId = req.user._id;
  try {
    const filteredUsers = await User.find({
      _id: { $ne: userId },
    }).select("-password");

    return res.status(200).json({
      message: "Fetched all users",
      filteredUsers,
    });
  } catch (error) {
    console.log("Error In getUserForSidebar ", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;

  try {
    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          reciverId: userToChatId,
        },
        {
          senderId: userToChatId,
          reciverId: myId,
        },
      ],
    });

    return res.status(200).json({
        messages: "fetched all the messages",
        messages,
    })
  } catch (error) {
    console.log("Error in get messages controller ", error.message);
    return res.status(500).json({
        message: "Internal server error"
    })
  }
};
