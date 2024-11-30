import mongoose, { Schema, Document, ObjectId, Model } from 'mongoose';
import User from './user';

export interface IChat extends Document {
    participants: mongoose.Types.ObjectId[];
}

export interface IChatDoc extends Model<IChat> { 
    findByParticipants: (participants: mongoose.Types.ObjectId[]) => Promise<IChat>;
    findByUser: (userId: mongoose.Types.ObjectId) => Promise<IChat[]>;
    createChat: (participants: mongoose.Types.ObjectId[]) => Promise<IChat>;
    chechUserInChat: (userId: mongoose.Types.ObjectId, chatId: mongoose.Types.ObjectId) => Promise<boolean>;
    getChatDetails: (chatId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => Promise<IChat | Boolean>;
}


const ChatSchema: Schema = new Schema<IChat, IChatDoc>({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
},{
    timestamps: { createdAt: "created_at", updatedAt: "modified_at" },
    autoIndex: true
});


ChatSchema.pre<IChat>('save', async function(next) {
    if (this.isModified('participants') || this.isNew) {
        const userDocs = await User.find({ _id: { $in: this.participants } });
        if(userDocs.length !== this.participants.length) {
            throw new Error('Invalid participants');
        }
    }
    next();
});


ChatSchema.static('findByParticipants', async function(participants: mongoose.Types.ObjectId[]): Promise<IChat> {
    const chats = await this.findOne({ participants: { $all: participants } });
    return chats;
});

ChatSchema.static('chechUserInChat', async function(userId: mongoose.Types.ObjectId, chatId: mongoose.Types.ObjectId): Promise<boolean> {
    const chat = await this.findById(chatId);
    if(!chat) {
        return false;
    }
    const participants = chat.participants;
    return participants.includes(userId);
});

ChatSchema.static('findByUser', async function(userId: mongoose.Types.ObjectId): Promise<IChat[]> {
    const chats = await this.find({ participants: userId }).populate('participants', 'username');
    return chats;
});

ChatSchema.static('createChat', async function(participants: mongoose.Types.ObjectId[]): Promise<IChat> {
    const chat = new this({ participants });
    await chat.save();
    return chat;
});

ChatSchema.static('getChatDetails', async function (chatId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId): Promise<IChat | Boolean> {
    const chat = await this.findOne({ _id: chatId, participants: userId  }).populate('participants', 'username').lean();
    if (!chat) {
        return false;
    }
    return chat;
});


const Chat = mongoose.model<IChat, IChatDoc>('Chat', ChatSchema);
export default Chat; 