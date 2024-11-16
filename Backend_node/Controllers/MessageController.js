import Message from "../Models/MessageModel.js";
import { getIO } from '../middleware/Socket.js';

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    
    // Create a new message document
    const message = new Message({
      senderId,
      receiverId,
      content,
    });

    await message.save();

    // Get Socket.IO instance
    const io = getIO();
    
    // Emit the message to the receiver
    io.to(receiverId.toString()).emit('newMessage', {
      message: {
        _id: message._id,
        senderId,
        receiverId,
        content,
        timestamp: message.timestamp
      }
    });

    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully', 
      data: message 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message', 
      error: error.message 
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    console.log(`Fetching messages between: ${userId1} and ${userId2}`);

    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    })
    .sort({ timestamp: 1 })
    .lean();

    if (!messages || messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No messages found.',
      });
    }

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message,
    });
  }
};

export { sendMessage, getMessages };