
import express from 'express';
import { sendMessage, getMessages } from '../controllers/MessageController.js'; 

const MessageRouter = express.Router();


MessageRouter.post('/send', sendMessage);
MessageRouter.get('/:userId1/:userId2', getMessages);

export default MessageRouter;
