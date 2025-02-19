import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

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

export const sendMessage = async (req,res) => {

    const {text,image} = req.body;
    const {id:reciverId} = req.params;
    const senderId = req.user._id;

    try {
        let imageUrl;

        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            reciverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // yet to add real time functionality => socket.io

        return res.status(201).json({
            message: "message sent successfully",
            newMessage
        })
    } catch (error) {
        console.log("Error in send message controller");
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}