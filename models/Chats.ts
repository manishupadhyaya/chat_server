import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
    userId: string,
    message: string,
    messageId: string,
    timeStamp: number,
    isSent: boolean
}

export const ChatSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    messageId: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Number,
        required: true
    },
    isSent: {
        type: Boolean,
        required: true
    }
});

export const Chats = mongoose.model<IUser>('Chats', ChatSchema)

type FDeleteMessageByUser = (params: { messageId: string, userId: string }, callback: (err: Object | null) => void) => void

export const deleteMessageByUser: FDeleteMessageByUser = ({ messageId, userId }, callback) => {
    Chats.deleteOne({ messageId, userId }, (err) => {
        if (err) callback(err);
        else callback(null);
    })
};