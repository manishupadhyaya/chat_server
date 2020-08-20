"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessageByUser = exports.Chats = exports.ChatSchema = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
exports.ChatSchema = new mongoose_1.default.Schema({
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
exports.Chats = mongoose_1.default.model('Chats', exports.ChatSchema);
exports.deleteMessageByUser = function (_a, callback) {
    var messageId = _a.messageId, userId = _a.userId;
    exports.Chats.deleteOne({ messageId: messageId, userId: userId }, function (err) {
        if (err)
            callback(err);
        else
            callback(null);
    });
};
//# sourceMappingURL=Chats.js.map