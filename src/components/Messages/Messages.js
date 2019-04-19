import React from 'react';
import ChatBox from "./ChatBox";
import Message from "./Message";

const Messages = props => {

        return (
            <div className='col-md-7' style={{padding: '10px'}}>
                {props.messages.length ? (
                    props.messages.map((message, i) => {
                        return (
                            <Message key={i} message={message}/>
                        )
                    }) 
                )  : <div className="no-message">No messages in chat room</div>}
                    <ChatBox
                        sendMessage={props.sendMessage}
                    />
            </div>
        )
    }

export default Messages;