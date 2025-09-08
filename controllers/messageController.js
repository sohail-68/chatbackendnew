const { Mongoose, default: mongoose } = require("mongoose");
const Message = require("../models/Message");
const User = require("../models/User");

// Send message

const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: "Receiver and content required" });
    }

    const newMessage = new Message({
      sender: req.user.id,
      receiver: receiverId,
      content,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get chat between 2 users
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params; // specific user ka ID

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    })
      .sort({ createdAt: 1 }) // oldest → newest
      .populate("sender", "username email")
      .populate("receiver", "username email");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};
const getUnreadCounts = async (req, res) => {
 try {
    const myId = req.user.id;

    const unread = await Message.aggregate([
      { $match: { receiver: new mongoose.Types.ObjectId(myId), read: false } },
      { $group: { _id: "$sender", count: { $sum: 1 } } },
    ]);

    // Convert array -> object for easy frontend use
    const counts = {};
    unread.forEach((u) => {
      counts[u._id.toString()] = u.count;
    });

    res.json(counts); 
    // { "senderId1": 2, "senderId2": 5 }
  } catch (error) {
    console.error("Unread counts error:", error);
    res.status(500).json({ error: "Failed to fetch unread counts" });
  }
};

const markMessagesFromUserRead = async (req, res) => {
  try {
    const myId = req.user.id;
    const { userId } = req.params;

    await Message.updateMany(
      { sender: userId, receiver: myId, read: false },
      { $set: { read: true } }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
};




// ✅ 1. Get unread counts (per sender)




module.exports = { sendMessage, getMessages,getUnreadCounts,markMessagesFromUserRead };
