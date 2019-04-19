import React from 'react';
import Users from "../components/Users/Users";
import Messages from "../components/Messages/Messages";
import EnterChat from "../components/EnterChat/EnterChat";
import Rooms from '../components/Rooms/Rooms';
import socketIOClient from 'socket.io-client';

class Chat extends React.Component {

    constructor(props){
        super(props);
        this.socket = null;
        this.state = {
            username : localStorage.getItem('username') ? localStorage.getItem('username') : '',
            uid : localStorage.getItem('uid') ? localStorage.getItem('uid') : this.generateUID(),
            chat_ready : false,
            activeChat: {uid: null},
            users : [],
            messages : [],
            rooms: [],
            message : ''
        }
    }

    componentDidMount(){
            this.initChat();
    }


    generateUID(){
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 15; i++){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        localStorage.setItem('uid', text);
        return text;
    }

    setUsername(username, e){
        this.setState({
            username : username
        }, () => {
            this.initChat();
        });
    }

    sendMessage(message){
        if(this.state.activeChat.type !== 'room') {
        this.socket.emit('messagePrivate', {
        message :{sender : localStorage.getItem('uid'),
            receiver : this.state.activeChat.uid,
            username: this.state.username,
            message : message,
            roomName : null }
        });
    } else {
        this.socket.emit('messageRoom', {
            message :{sender : localStorage.getItem('uid'),
                receiver : null,
                username: this.state.username,
                message : message,
                roomName : this.state.activeChat.uid }
            });
    }
       // this.scrollToBottom();
    }

    scrollToBottom(){
        let messages = document.getElementsByClassName('messages')[0];
        messages.scrollTop = messages.scrollHeight - messages.clientHeight;
    }

      initChat = () => {
        if(this.state.username.length) {        
        localStorage.setItem('username', this.state.username);
        this.setState({
            chat_ready : true,
        });
        }

        this.socket = socketIOClient('ws://localhost:3000', {
            query : 'username='+this.state.username+'&uid='+this.state.uid
        });

        this.socket.on('updateUsersList', (users) => {
            this.setState({users});
        });

        this.socket.on('newUserAddedInRoom', (data) => {
            if(this.state.activeChat.uid === data.roomName) {
                const message = {roomName: data.roomName, username:data.userName, message : {type :'text' , text : 'joined the conversation'}};
                let newMessages = [...this.state.messages];
                newMessages.push(message);
                this.setState({messages : newMessages});
            }
        })

        this.socket.on('updateRoomsList', (rooms) => {
            this.setState({rooms});
        });
 
        this.socket.on('receiveMessagesForChat', (messages) => {
            this.setState({messages }); 
        })

     this.socket.on('newPrivateMessage', (message) => {
        if((this.state.activeChat.uid === message.sender) || (this.state.activeChat.uid === message.receiver))
            this.setState({
                messages : [...this.state.messages,message]
        });
    })

    this.socket.on('newRoomMessage', (message) => {
        if((this.state.activeChat.uid === message.roomName))
        this.setState({
            messages : [...this.state.messages,message]
           });
    })
}

    onClickUser = (uid) => {
        if(this.state.activeChat.uid !== uid) {
        this.setState({activeChat : {uid,type: 'private'}}, () => {
            this.socket.emit('getMessagesForChat',{userData : {receiverId : uid, senderId : this.state.uid, type: 'private'}});
        })
    }
    }

    onAddNewRoom = roomName => {
        this.socket.emit('createRoom',roomName);
        this.setState({activeChat : {uid : roomName,type: 'room'}}, () => {
            this.socket.emit('getMessagesForChat',{userData : {roomName,receiverId : null, senderId : this.state.uid, type: 'room'}});
        })
    }

    onClickRoom = roomName => {
        if(this.state.activeChat.uid !== roomName) {
            this.socket.emit('joinRoom',{roomName,userData: {userName:this.state.username}})
            this.setState({activeChat : {uid : roomName,type: 'room'}}, () => {
                this.socket.emit('getMessagesForChat',{userData : {roomName,receiverId : null, senderId : this.state.uid, type: 'room'}});
            })
        }
    }

    render() {
        return (
            <div className="chat container">
                {this.state.chat_ready ? (
                    <React.Fragment>
                        <div className="row">
                        <Users users={this.state.users} onClickUser={this.onClickUser}/>
                        <Rooms rooms={this.state.rooms} onAddNewRoom={this.onAddNewRoom} onClickRoom={this.onClickRoom}  />
                        </div>
                        <div className="row">
                            {this.state.activeChat.uid?                         
                                 <Messages
                                      sendMessage={this.sendMessage.bind(this)}
                                       messages={this.state.messages}
                                      /> : <h2>Please select a chat</h2>}
                        </div>
                        </React.Fragment>
                ) : (
                    <EnterChat
                        setUsername={this.setUsername.bind(this)}
                    />
                )}
            </div>
        )
    }
}

export default Chat;