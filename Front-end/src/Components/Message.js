import React from 'react';
import './Message.css';

export default function Message({ message }) {
    const date = new Date(message.timestamp).toLocaleString();
    return (
        <div className="message-container">
            <div className={`message__info ${message.incoming ? "incoming" : "outgoing"}`}>
                <span className='message__username'> {message.username}</span>
                <span className="message__timestamp">
                    {date}
                </span>
                <span className='message__text'>{message.message}</span>
            </div>
        </div>
    )
}
