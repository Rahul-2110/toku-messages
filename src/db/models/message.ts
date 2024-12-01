import mongoose, { Model } from 'mongoose';
import Chat, { IChat } from './chat';
import { boolean } from 'joi';


export interface IMessage extends Document {
    chat_id: mongoose.Types.ObjectId;
    sender_id: mongoose.Types.ObjectId;
    content: string;
    status: string;
    timestamp: Date;
}

export interface IMessageDoc extends Model<IMessage> {
    findByChatId: (chatId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => Promise<IMessage[] | Boolean>;
    findByUserId: (userId: mongoose.Types.ObjectId) => Promise<IMessage[]>;
    updateMessageStatus: (messageId: mongoose.Types.ObjectId, status: string) => Promise<IMessage>;
    updateChatStatus: (chatId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, status: string) => Promise<IChat>;
}

const messageSchema = new mongoose.Schema({
    chat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['delivered', 'read', 'failed'], default: 'delivered' }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "modified_at" },
});


messageSchema.static('findByChatId', async function (chatId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId): Promise<IMessage[] | Boolean>{
    let chat = await Chat.chechUserInChat(userId, chatId);
    if (!chat) {
        return false;
    }
    const messages = await this.find({ chat_id: chatId }).populate('sender_id', 'username');;
    return messages;
});


messageSchema.static('findByUserId', async function (userId: mongoose.Types.ObjectId): Promise<IMessage[]> {
    const messages = await this.find({ sender_id: userId }).populate('sender_id', 'username');;
    return messages;
});

messageSchema.static('updateMessageStatus', async function (messageId: mongoose.Types.ObjectId, status: string): Promise<IMessage> {
    const message = await this.findByIdAndUpdate(messageId, { status }, { new: true }).populate('sender_id', 'username');
    return message;
});


messageSchema.static('updateChatStatus', async function (chatId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, status: string): Promise<IChat> {
    const messages = await this.updateMany({ chat_id: chatId, sender_id: { $not: { $eq: userId } } }, { status }, { new: true }).populate('sender_id', 'username');
    return messages;
});


const Message = mongoose.model<IMessage, IMessageDoc>('Message', messageSchema);
export default Message; 
