"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//mongodb://manish:mongo123456@ds157818.mlab.com:57818/chatserver
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const Chats_1 = require("./models/Chats");
// mongoose.Promise = global.Promise;
const app = express_1.default();
app.use(cors_1.default());
mongoose_1.default.connect(`${process.env.MONGO_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
app.use(body_parser_1.default.urlencoded({
    extended: true
}));
app.use(body_parser_1.default.json());
app.post('/chatlogs/:userId', (req, res) => {
    let { isSent, message, timeStamp } = req.body;
    let { userId } = req.params;
    let messageId = uuid_1.v4();
    let chatLog = new Chats_1.Chats({
        userId,
        message,
        messageId,
        timeStamp,
        isSent
    });
    chatLog.save((err) => {
        if (err) {
            console.log(err);
            res.send("Error saving data to database");
        }
        else {
            res.json({
                message: "Message Id Generated is:" + messageId
            });
            // res.send("Data saved successfully in database")
        }
    });
});
app.get('/chatlogs/:userId', (req, res) => {
    let userId;
    let limit;
    let start;
    userId = req.params.userId;
    limit = parseInt(`${req.query.limit}`);
    start = parseInt(`${req.query.start}`);
    if (start == null)
        start = 0;
    if (limit == null)
        limit = 10;
    Chats_1.Chats.find({
        userId
    })
        .skip(start)
        .limit(limit)
        .sort({
        timeStamp: -1
    })
        .exec((err, docs) => {
        res.json(docs);
    });
});
app.delete('/chatlogs/:userId', (req, res, next) => {
    let userId;
    userId = req.params.userId;
    Chats_1.Chats.find({
        userId
    }).remove().exec();
    res.json({
        message: "Messages have been deleted"
    });
});
app.delete('/chatlogs/:userId/:messageId', (req, res, next) => {
    let userId;
    let messageId;
    userId = req.params.userId;
    messageId = req.params.messageId;
    Chats_1.deleteMessageByUser({
        userId,
        messageId
    }, (err) => {
        if (err)
            res.json({
                message: "Error Deleting Message"
            });
        else {
            res.json({
                message: "Message has been deleted"
            });
        }
    });
});
const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
    console.log("App listening at http://localhost:" + PORT);
});
