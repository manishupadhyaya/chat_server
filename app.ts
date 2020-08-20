//mongodb://manish:mongo123456@ds157818.mlab.com:57818/chatserver
import * as dotenv from 'dotenv'
dotenv.config()

import express, {
    Application,
    Request,
    Response,
    NextFunction
} from 'express'
import mongoose from 'mongoose';
import bodyParser from 'body-parser'
// import cors from 'cors'

import {
    v4 as uuidv4
} from 'uuid'

import {
    Chats,
    deleteMessageByUser
} from './models/Chats'

// mongoose.Promise = global.Promise;

const app: Application = express();
// app.use(cors())
app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
mongoose.connect(
    `${process.env.MONGO_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


type TReqParams = { userId: string };
type TReqBody = { isSent: boolean, message: string, timeStamp: number }

app.post('/chatlogs/:userId', (req: Request<TReqParams, any, TReqBody>, res: Response) => {
    let { isSent, message, timeStamp } = req.body;
    let { userId } = req.params;
    let messageId = uuidv4();

    let chatLog = new Chats({
        userId,
        message,
        messageId,
        timeStamp,
        isSent
    });

    chatLog.save((err) => {
        if (err) {
            console.log(err);
            res.send("Error saving data to database")
        } else {
            res.json({
                message: "Message Id Generated is:" + messageId
            });
            // res.send("Data saved successfully in database")
        }
    })
})

app.get('/chatlogs/:userId', (req: Request, res: Response) => {
    let userId: string;
    let limit: number;
    let start: number;
    userId = req.params.userId
    limit = parseInt(`${req.query.limit}`);
    start = parseInt(`${req.query.start}`);
    if (start == null) start = 0;
    if (limit == null) limit = 10;

    Chats.find({
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
    let userId: string;
    userId = req.params.userId
    Chats.find({
        userId
    }).remove().exec();
    res.json({
        message: "Messages have been deleted"
    });
})

app.delete('/chatlogs/:userId/:messageId', (req, res, next) => {
    let userId: string;
    let messageId: string;
    userId = req.params.userId
    messageId = req.params.messageId
    deleteMessageByUser({
        userId,
        messageId
    }, (err) => {
        if (err) res.json({
            message: "Error Deleting Message"
        })
        else {
            res.json({
                message: "Message has been deleted"
            });
        }
    })
})

const PORT = process.env.PORT || 3100

app.listen(PORT, () => {
    console.log("App listening at http://localhost:" + PORT)
})