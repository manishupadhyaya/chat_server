//mongodb://manish:mongo123456@ds157818.mlab.com:57818/chatserver
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')
const {
    v4: uuidv4
} = require('uuid')
const {
    Chats,
    deleteMessageByUser
} = require('./models/Chats')

mongoose.Promise = global.Promise;

const app = express();

mongoose.connect(
        process.env.MONGOURI, {
            useNewUrlParser: true
        }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors())

app.post('/chatlogs/:userId', (req, res, next) => {
    let {
        message,
        isSent,
        timeStamp
    } = req.body;
    let userId = req.params.userId
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
                message:"Message Id Generated is:" + messageId
            });
            // res.send("Data saved successfully in database")
        }
    })
})

app.get('/chatlogs/:userId', (req, res, next) => {
    let userId = req.params.userId
    console.log(userId)
    let {
        limit,
        start
    } = req.query;
    if (start == null) start = 0;
    if (limit == null) limit = 10;

    Chats.find({
        userId
    })
    .skip(parseInt(start))
    .limit(parseInt(limit))
    .sort({
        timeStamp: -1
    })
    .exec((err, docs) => {
        res.json(docs);
    });
});

app.delete('/chatlogs/:userId', (req, res, next) => {
    let userId = req.params.userId
    Chats.find({
        userId
    }).remove().exec();
    res.json({
        message: "Messages have been deleted"
    });
})

app.delete('/chatlogs/:userId/:messageId', (req, res, next) => {
    let {
        userId,
        messageId
    } = req.params;

    deleteMessageByUser({
        userId,
        messageId
    }, (err) => {
        if (err) res.json({
            message: err.message
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