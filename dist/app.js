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
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var uuid_1 = require("uuid");
var Chats_1 = require("./models/Chats");
mongoose_1.default.Promise = global.Promise;
var app = express_1.default();
app.use(cors_1.default());
mongoose_1.default.connect("" + process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(function () { return console.log('MongoDB Connected'); })
    .catch(function (err) { return console.log(err); });
app.use(body_parser_1.default.urlencoded({
    extended: true
}));
app.use(body_parser_1.default.json());
// type TReqParams = { userId: string };
// type TReqBody = { isSent: boolean, message: string, timeStamp: number }
app.post('/chatlogs/:userId', function (req, res) {
    var _a = req.body, isSent = _a.isSent, message = _a.message, timeStamp = _a.timeStamp;
    var userId = req.params.userId;
    var messageId = uuid_1.v4();
    var chatLog = new Chats_1.Chats({
        userId: userId,
        message: message,
        messageId: messageId,
        timeStamp: timeStamp,
        isSent: isSent
    });
    chatLog.save(function (err) {
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
app.get('/chatlogs/:userId', function (req, res) {
    console.log(req.params);
    var userId;
    var limit;
    var start;
    userId = req.params.userId;
    limit = parseInt("" + req.query.limit);
    start = parseInt("" + req.query.start);
    if (start == null)
        start = 0;
    if (limit == null)
        limit = 10;
    Chats_1.Chats.find({
        userId: userId
    })
        .skip(start)
        .limit(limit)
        .sort({
        timeStamp: -1
    })
        .exec(function (err, docs) {
        res.json(docs);
    });
});
app.delete('/chatlogs/:userId', function (req, res, next) {
    var userId;
    userId = req.params.userId;
    Chats_1.Chats.find({
        userId: userId
    }).remove().exec();
    res.json({
        message: "Messages have been deleted"
    });
});
app.delete('/chatlogs/:userId/:messageId', function (req, res, next) {
    var userId;
    var messageId;
    userId = req.params.userId;
    messageId = req.params.messageId;
    Chats_1.deleteMessageByUser({
        userId: userId,
        messageId: messageId
    }, function (err) {
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
var PORT = process.env.PORT || 3100;
app.listen(PORT, function () {
    console.log("App listening at http://localhost:" + PORT);
});
//# sourceMappingURL=app.js.map