import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import SourceMapSupport from 'source-map-support';

import mysql from 'mysql';

let users = {};
let rooms = [];

let messages = [];

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
SourceMapSupport.install();
let server = require('http').Server(app);
let io = require('socket.io')(server);

const getUsers = () => {
    return Object.keys(users).map( (key) =>( {uid : users[key].uid , name : users[key].userName}));
};

const getRooms = () => {
    return rooms;
};

const getSocketIdForUser = (uid) => {
    return users[uid].socketId
}


const createUser = (user) => {
    users = Object.assign({
        // create a new user on users object with uid
        [user.uid] : {
            userName : user.userName,
            uid : user.uid,
            socketId : user.socketId
        }
    }, users);
};

const createRoom = (roomName) => {
  rooms.push(roomName);
};

const createSocket = (user) => {
    let curUser = users[user.uid],
        updatedUser = {
            [user.uid] : {...curUser, socketId : user.socketId}
        };
    users = Object.assign(users, updatedUser);
};


server.listen(3000, () => {
  console.log('Running server on 127.0.0.1:' + 3000);
});


io.on('connection', (socket) => {
    let query = socket.request._query,
        user = {
            userName : query.username,
            uid : query.uid,
            socketId : socket.id
        };

        if(users[user.uid] !== undefined){
            createSocket(user);
            socket.emit('updateUsersList', getUsers());
        }
        else{
            createUser(user);
            io.emit('updateUsersList', getUsers());
        }

        socket.emit('updateRoomsList',getRooms());
        
    socket.on('createRoom', (roomName) => {
        createRoom(roomName);
        socket.join(roomName);
        io.emit('updateRoomsList' , getRooms());
    })    

    socket.on('joinRoom', (data) => {
        socket.join(data.roomName);
        io.in(data.roomName).emit('newUserAddedInRoom', {userName : data.userData.userName, roomName : data.roomName});
    })

    socket.on('messageRoom' , (data) => {
        messages.push(data.message);
        io.in(data.message.roomName).emit('newRoomMessage', data.message);
    })

    socket.on('messagePrivate' , (data) => {
        messages.push(data.message)
        io.to(`${getSocketIdForUser(data.message.receiver)}`).emit('newPrivateMessage', data.message);
        io.to(`${getSocketIdForUser(data.message.sender)}`).emit('newPrivateMessage', data.message);
    })

    socket.on('getMessagesForChat', (data) => {
        let chatMessages = [];
        if(messages.length > 0) {
            if(data.userData.type == 'private') {
                chatMessages = messages.filter((msg) => (msg.receiver === data.userData.receiverId || msg.sender === data.userData.receiverId) &&
                                                   (msg.receiver === data.userData.senderId || msg.sender === data.userData.senderId));
            } else {
                chatMessages = messages.filter((msg) => data.userData.roomName === msg.roomName);
            }         
        }        
        socket.emit('receiveMessagesForChat',chatMessages);
    })

    socket.on('disconnect', () => {
       // removeSocket(socket.id);
        io.emit('updateUsersList', getUsers());
    });
});


