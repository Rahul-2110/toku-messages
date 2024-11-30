import express, { Request, Response } from "express";
import Message from "../db/models/message";
// import { sendMessageToQueue } from "../utils/kafka/producer";
import validateRequest from "../utils/validator/request";
import Chat from "../db/models/chat";
import mongoose from "mongoose";
import { patchMessageStatusSchema, postMessageSchema } from "../utils/validator/messages";

const router = express.Router();

router.post('/', validateRequest(postMessageSchema), async (req: Request, res: Response) => {
    try {
        const { chat_id, content } = req.body;
        const user_id = req.user._id;
        const messageData = { chat_id, sender_id: user_id, content, status: "delivered" };
        let chat = await Chat.chechUserInChat(new mongoose.Types.ObjectId(user_id), new mongoose.Types.ObjectId(chat_id));
        if (!chat) {
            return res.status(400).json({ message: 'Invalid chat' });
        }

        const newMessage = new Message(messageData);
        await newMessage.save();

        // await sendMessageToQueue(messageData);

        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.get("/:messageId", async (req: Request, res: Response) => {
    try {
        const { messageId } = req.params;
        const user_id = req.user._id;

        const message = await Message.findById(messageId).populate('sender_id', 'username');;

        if (!message) return res.status(404).json({ error: "Message not found" });
        let chat = await Chat.chechUserInChat(new mongoose.Types.ObjectId(user_id), message.chat_id);
        if (!chat) return res.status(404).json({ error: "Message not found" });

        res.json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.patch(
    "/:messageId/status",
    validateRequest(patchMessageStatusSchema),
    async (req: Request, res: Response) => {
        try {
            const { messageId } = req.params;
            const { status } = req.body;

            const validStatuses = ["delivered", "read"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ error: "Invalid status" });
            }

            let message = await Message.findById(messageId);

            if (!message) return res.status(404).json({ error: "Message not found" });

            let chat = await Chat.chechUserInChat(new mongoose.Types.ObjectId(req.user._id), message.chat_id);

            if (!chat) return res.status(404).json({ error: "Message not found" });


            if (message.status !== status && status === "delivered") {
                message.status = "read";
                await message.save();
            }

            res.json({ message: "Message status updated successfully" });
            
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
);

export default router;
