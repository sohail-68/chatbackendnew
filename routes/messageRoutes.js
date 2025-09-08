const express = require("express");
const isAuthenticated = require("../middlewares/authMiddleware");
const { sendMessage,getMessages,getUnreadCounts,markMessagesFromUserRead} = require("../controllers/messageController");

const router = express.Router();

// Send message to specific user
router.post("/send", isAuthenticated, sendMessage);

router.get("/:userId", isAuthenticated, getMessages);


module.exports = router;
