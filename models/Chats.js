const mongoose = require('mongoose')
var ChatSchema = new mongoose.Schema({
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
    isSent:{
        type: Boolean,
        required: true
    }
});

const Chats = mongoose.model('Chats', ChatSchema)


const deleteMessageByUser = function ({ messageId, userId }, callback) {
    Chats.deleteOne({ messageId, userId  }, (err) => {
        if (err) callback(err);
        else callback(null);
    })
};

module.exports = { Chats, deleteMessageByUser }