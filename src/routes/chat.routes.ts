import express, { Request, Response } from 'express';
import Chat from '../db/models/chat';
import User from '../db/models/user';
import Message from '../db/models/message';
import mongoose from "mongoose";
import { startChatSchema } from '../utils/validator/chat';
import validateRequest from '../utils/validator/request';
// import { updateChatStatusStatus } from '../utils/kafka/producer';

const router = express.Router();

router.post('/start', validateRequest(startChatSchema), async (req: Request, res: Response) => {
    try {
        const { participant } = req.body;
        const userDoc = await User.findByUsername(participant);
        if(!userDoc) {
            return res.status(400).json({ message: 'Invalid participant' });
        }
        let chat = await Chat.findByParticipants([userDoc._id, req.user._id])
        if (!chat) {
            chat = await Chat.createChat([userDoc._id, req.user._id]);
            return res.status(201).json({ message: 'Chat started', chat });
        }
        return res.status(200).json({ message: 'Chat started', chat });

    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});


router.get('/list', async (req: Request, res: Response) => {
    try {
        const user_id = req.user._id;
        const chats = await Chat.findByUser(user_id);
        if (!chats) return res.status(404).json({ error: "No chats found" });
        res.json(chats);

    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});


router.get('/:chatId', async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const user_id = req.user._id;
        const chat = await Chat.getChatDetails(new mongoose.Types.ObjectId(chatId), user_id);
        
        if (!chat) return res.status(404).json({ error: "Chat not found" });

        let messagesCount = await Message.countDocuments({ chat_id: chatId });

        res.json({...chat, total_messages: messagesCount});
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});


router.get('/:chatId/messages', async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const user_id = req.user._id;
        const messages = await Message.findByChatId(new mongoose.Types.ObjectId(chatId),user_id);
        if (!messages) {
            return res.status(404).json({ error: "No messages found" });
        }
        // await updateChatStatusStatus({chat_id: chatId, user_id, status: "read"});
        await Message.updateChatStatus(new mongoose.Types.ObjectId(chatId), user_id, "read");
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

export default router; 