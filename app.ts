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
import cors from 'cors'

import {
    v4 as uuidv4
} from 'uuid'

import {
    Chats,
    deleteMessageByUser
} from './models/Chats'
mongoose.Promise = global.Promise;

const app: Application = express();
app.use(cors())
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


app.post('/chatlogs/:userId', (req: Request, res: Response) => {

    let isSent: boolean;
    let message: string;
    let timeStamp: string;
    let userId: string;
    isSent = req.body.isSent;
    userId = req.params.userId;
    message = req.body.message
    timeStamp = req.body.timeStamp
    let messageId: string;
    messageId = uuidv4();

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

    console.log(req.params)
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

app.delete('/chatlogs/:userId', (req: Request, res: Response) => {

    let userId: string;
    userId = req.params.userId
    Chats.find({
        userId
    }).remove().exec();
    res.json({
        message: "Messages have been deleted"
    });
})

app.delete('/chatlogs/:userId/:messageId', (req: Request, res: Response) => {

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