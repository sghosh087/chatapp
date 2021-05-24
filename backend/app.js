const express = require('express');
const app = express();
const Mongoose = require('mongoose');
const bodyParser = require('body-parser')

require('dotenv').config();

const userRouter = require('./routes/user');


const auth = require('./middlewares/auth')

const users = [];

// CORS headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, *");
    next();
})

app.use(bodyParser.json());

// User related routes
app.use('/api/user', userRouter);

// Chat related routes
app.get('/api/loggedin-users',auth.checkAuth,(req, res, next) => {
    return res.status(200).json({ users: users});
});

// Error handling
app.use((err, req, res, next) => {
    if (!err.status) err.status = 500;
    res.status(err.status).json({
        message: err.message
    })
})


const PORT = process.env.PORT || 5000;
const dbURL = process.env.mongoURL;


Mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    connected => {
        const server = app.listen(PORT)
        const io = require('socket.io')(server, {
            cors: true,
            origins: ["http://localhost:4200"],
        });
        io.on('connection', (socket) => {
            console.log('Connected');
            socket.join('chat');
            socket.on('setUserName', (data) => {
                users.push({ id: socket.id, userName: data.userName });
                io.to('chat').emit('userAdded', { id: socket.id, userName: data.userName } );
                
            })

            socket.on('message', (data) => {
                //console.log('message event called ', data.userName)
                io.to('chat').emit('roomMessage', { userName: data.userName,message: data.message });
            })

            socket.on('disconnect', () => {
                console.log(users, socket.id);
                const userIndex = users.findIndex(user => {
                    return user.id === socket.id;
                })
                console.log(userIndex);
                if(userIndex >= 0) {
                    const disconnectedUser = users.splice(userIndex,1);
                    io.to('chat').emit('userLeft', disconnectedUser)
                    console.log('user left', disconnectedUser)
                }
                
                console.log('Disconnected from chat');
            })
        })
    }
).catch(
    err => {
        console.log('Unable to connect to mongodb : ', err)
    }
)
